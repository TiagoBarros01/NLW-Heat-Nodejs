import 'dotenv/config';
import express, { Request, Response } from 'express';

const app = express();

app.listen(4000, () => console.log('🔥 Server is running at port 4000'));

app.get('/auth', (req: Request, res: Response) =>
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  )
);

app.get('/signin/callback', (req: Request, res: Response) => {
  const { code } = req.query;

  return res.json(code)
});
