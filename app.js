import express from 'express';
import articleRouter from './routers/article.js';

const app = express();

app.use(express.json());

app.use('/articles', articleRouter);
app.listen(3000);
