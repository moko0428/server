import Joi from 'joi';

// 게시글 생성 검증 스키마
export const userCreateSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const userResponseSchema = Joi.object({
  id: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().required(),
});

export const userDeleteSchema = Joi.object({
  passwordValidation: Joi.string().required(),
});

export const userPartialUpdateSchema = Joi.object({
  password: Joi.string(),
  passwordValidation: Joi.string().required(),
  username: Joi.string(),
  email: Joi.string(),
}).min(2);
