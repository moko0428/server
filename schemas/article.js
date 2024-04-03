import Joi from 'joi';

// 게시글 생성 검증 스키마
export const articleCreateSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

export const articleUpdateSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

export const articlePartialUpdateSchema = Joi.object({
  title: Joi.string(),
  content: Joi.string(),
}).min(1);
