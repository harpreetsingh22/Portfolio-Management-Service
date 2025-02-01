import express from 'express';
import cors from 'cors';
import { port as configPort } from './config/index.js';
import tradeRoutes from './routes/trade.js';
import PortfolioRoutes from './routes/portfolio.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(tradeRoutes);
app.use(PortfolioRoutes);

// Start the server
const port = configPort || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
