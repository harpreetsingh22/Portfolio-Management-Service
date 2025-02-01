import express from 'express';
import { getPortfolio, getPortfolioReturns } from '../controllers/portfolio.js'

const router = express.Router();

router.get('/portfolio', getPortfolio);
router.get('/portfolio/returns', getPortfolioReturns);

export default router;