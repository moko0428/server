import express from 'express';
import articleRouter from './routers/article.js';
import userRouter from './routers/user.js';
import { halMiddleware } from './middlewares/hal.js';
import morgan from 'morgan';

const app = express();

app.use(morgan());
app.use(express.json());
app.use(halMiddleware);

app.use('/articles', articleRouter);
app.use('/users', userRouter);

app.listen(3000);
