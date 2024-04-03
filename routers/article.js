import { randomUUID } from 'crypto';
import express from 'express';
import db from '../db.js';

const router = express.Router();

router
  .route('')
  // 게시글 생성하기
  .post((req, res) => {
    const article = {
      ...req.body,
      id: randomUUID(),
    };
    db.data.articles.push(article);
    db.write();
    res.status(201).json(article);
  })
  // 게시글 조회
  .get((req, res) => {
    res.status(200).json(db.data.articles);
  });

// 게시글 상세 조회하기
router.get('/:articleId', (req, res) => {
  // article을 찾는 로직
  const article = db.data.articles.find(
    ({ id }) => id === req.params.articleId
  );
  if (!article) {
    res.status(404).send();
  }
  res.status(200).json(article);
});

// 게시글 수정하기 (모든 값을 호출 -> patch 처럼 값을 호출하면 원본 데이터 유실의 문제가 도래된다.)
router.put('/:articleId', (req, res) => {
  // article을 찾는 로직
  const { articleId } = req.params;
  const articleIndex = db.data.articles.findIndex(({ id }) => id === articleId);
  if (articleIndex < 0) {
    res.status(404).send();
  }
  const article = { ...req.body, id: articleId };
  db.data.articles[articleIndex] = article;
  db.write();
  res.status(200).json(article);
});

// 게시글 수정하기 (수정하려는 값만 호출)
router.patch('/:articleId', (req, res) => {
  // article을 찾는 로직
  const { articleId } = req.params;
  const articleIndex = db.data.articles.findIndex(({ id }) => id === articleId);
  if (articleIndex < 0) {
    res.status(404).send();
  }
  const article = db.data.articles[articleIndex];
  for (const key of Object.keys(req.body)) {
    article[key] = req.body[key];
  }
  db.data.articles[articleIndex] = article;
  db.write();
  res.status(200).json(article);
});

// 게시글 삭제하기
router.delete('/:articleId', (req, res) => {
  // article을 찾는 로직
  const { articleId } = req.params;
  const articleIndex = db.data.articles.findIndex(({ id }) => id === articleId);
  if (articleIndex < 0) {
    res.status(404).send();
  }
  db.data.articles.splice(articleIndex, 1);
  db.write();
  // 전달할게 없어서 204를 반환한다. 대체로 그렇다
  res.status(204).send();
});

export default router;
