import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import router from './routes/api/v1';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port: string = process.env.PORT || '8000';

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running');
});

app.use(
  cors({
    origin: '*',
  })
);

app.use(express.json());
app.use('/', router);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
