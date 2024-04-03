import { randomUUID } from 'crypto';
import express from 'express';
import db from '../db.js';
import { articleCreateSchema } from '../schemas/article.js';
import { articlePartialUpdateSchema } from '../schemas/article.js';
import { articleUpdateSchema } from '../schemas/article.js';
import { logger } from '../core/logger.js';

const router = express.Router();

// 게시글 생성하기
router.post('', (req, res) => {
  const { error, value } = articleCreateSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }
  const article = {
    ...value,
    id: randomUUID(),
  };

  db.data.articles.push(article);
  db.write();

  return res.status(201).json({
    _embedded: {
      article: {
        _links: {
          self: {
            href: `${req.originalUrl}/${article.id}`,
          },
        },
        ...article,
      },
    },
  });
});

// 게시글 조회
router.get('', (req, res) => {
  logger.debug('게시글 목록 조회');
  return res.status(200).json({
    _embedded: {
      articles: db.data.articles.map((article) => ({
        _links: {
          self: {
            href: `${req.originalUrl}/${article.id}`,
          },
        },
        ...article,
      })),
    },
  });
});

// 게시글 상세 조회하기
router.get('/:articleId', (req, res) => {
  // article을 찾는 로직
  const article = db.data.articles.find(
    ({ id }) => id === req.params.articleId
  );

  if (!article) {
    return res.status(404).json({
      _links: {
        articles: {
          href: req.baseUrl,
        },
      },
      message: '조회하려는 게시글이 존재하지 않습니다.',
      error: 'Not Found',
    });
  }

  return res.status(200).json({
    _embedded: {
      article: {
        _links: {
          self: {
            href: `${req.originalUrl}`,
          },
        },
        ...article,
      },
    },
  });
});

// 게시글 수정하기 (모든 값을 호출 -> patch 처럼 값을 호출하면 원본 데이터 유실의 문제가 도래된다.)
router.put('/:articleId', (req, res) => {
  // article을 찾는 로직
  const { articleId } = req.params;
  const articleIndex = db.data.articles.findIndex(({ id }) => id === articleId);

  if (articleIndex < 0) {
    return res.status(404).json({
      _links: {
        articles: {
          href: req.baseUrl,
        },
      },
      message: '조회하려는 게시글이 존재하지 않습니다.',
      error: 'Not Found',
    });
  }

  const { error, value } = articleUpdateSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      _links: {
        self: {
          href: req.originalUrl,
        },
      },
      message: error.details[0].message,
    });
  }

  const article = { ...value, id: articleId };

  db.data.articles[articleIndex] = article;
  db.write();

  return res.status(200).json({
    _embedded: {
      article: {
        _links: {
          self: {
            href: `${req.originalUrl}`,
          },
        },
        ...article,
      },
    },
  });
});

// 게시글 수정하기 (수정하려는 값만 호출)
router.patch('/:articleId', (req, res) => {
  // article을 찾는 로직
  const { articleId } = req.params;
  const articleIndex = db.data.articles.findIndex(({ id }) => id === articleId);

  if (articleIndex < 0) {
    return res.status(404).json({
      _links: {
        articles: {
          href: req.baseUrl,
        },
      },
      message: '조회하려는 게시글이 존재하지 않습니다.',
      error: 'Not Found',
    });
  }
  const { error, value } = articlePartialUpdateSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const article = db.data.articles[articleIndex];
  for (const key of Object.keys(value)) {
    article[key] = value[key];
  }

  db.data.articles[articleIndex] = article;
  db.write();

  return res.status(200).json({
    _embedded: {
      article: {
        _links: {
          self: {
            href: `${req.originalUrl}`,
          },
        },
        ...article,
      },
    },
  });
});

// 게시글 삭제하기
router.delete('/:articleId', (req, res) => {
  // article을 찾는 로직
  const { articleId } = req.params;
  const articleIndex = db.data.articles.findIndex(({ id }) => id === articleId);

  if (articleIndex < 0) {
    return res.status(404).json({
      _links: {
        articles: {
          href: req.baseUrl,
        },
      },
      message: '조회하려는 게시글이 존재하지 않습니다.',
      error: 'Not Found',
    });
  }

  db.data.articles.splice(articleIndex, 1);
  db.write();

  // 전달할게 없어서 204를 반환한다. 대체로 그렇다
  return res.status(200).json({
    _links: {
      articles: {
        href: req.baseUrl,
      },
    },
    message: '게시글을 성공적으로 삭제했습니다.',
  });
});

export default router;
