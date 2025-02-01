import express from 'express';
import { getTradeById, getTrades, addTrade, updateTrade, deleteTrade } from '../controllers/trade.js'

const router = express.Router();

router.get('/trade/:id', getTradeById);
router.get('/trades', getTrades);
router.post('/trade', addTrade);
router.patch('/trade/:id', updateTrade);
router.delete('/trade/:id', deleteTrade);

export default router;