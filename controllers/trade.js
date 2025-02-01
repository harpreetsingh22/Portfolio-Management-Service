

import knex from 'knex';
import knexConfig from '../knexfile.js';
import { handleError, portfolioNotFoundError, insufficientQuantityError, securityNotFoundError, tradeNotFoundError } from '../utilities/error.js';
import { idSchema } from '../validations/requests/common.js'
import { getTradesQueryParamsFilterSchema, tradeCreationPayloadSchema, tradeUpdationPayloadSchema } from '../validations/requests/trade.js'
import { validateSchema } from '../utilities/common.js'
import { TradeService } from '../services/trade.js';
import prepareTradeResponse from '../mappers/trade.js';
import { preparePaginatedResponse } from '../mappers/common.js';
import { PortfolioService } from '../services/portfolio.js';
import { SecurityService } from '../services/security.js'
import constants from '../constants/index.js';

export const getTradeById = async (req, res) => {
  try {
    const validationError = validateSchema(idSchema, req.params, res);
    if (validationError !== null) {
      return validationError;
    }

    const { id } = req.params;
    const trade = await TradeService.getTradeById({ id, embed: '[security]' });
    if(!trade){
      throw tradeNotFoundError(id);
    }

    return res.status(200).json({ status: "success", data: { trade: prepareTradeResponse(trade) } });
  } catch (err) {
    return handleError(err, res);
  }
};

export const getTrades = async (req, res) => {
  try {
    const validationError = validateSchema(getTradesQueryParamsFilterSchema, req.query, res);
    if (validationError !== null) {
      return validationError;
    }

    const { securityId, tradeType, page, limit } = req.query;
    const filters = {
      securityId,
      tradeType,
    }

    const trades = await TradeService.getTrades({ filters, page, limit, embed: '[security]' });

    let { results, total } = trades;
    results = results.map((x) => prepareTradeResponse(x));

    return res.status(200).json({ status: "success", data: preparePaginatedResponse(results, total, page, limit) });
  } catch (err) {
    return handleError(err, res);
  }
};

export const addTrade = async (req, res) => {
  let txn = null;
  try {
    // Validate request body schema
    const bodyValidationError = validateSchema(tradeCreationPayloadSchema, req.body, res);
    if (bodyValidationError) return bodyValidationError;

    const { tradeType, securityId, price, quantity } = req.body;

    // Fetch existing security details
    const security = await SecurityService.getSecurityById({ id: securityId });
    if (!security) {
      throw securityNotFoundError();
    }

    // Fetch portfolio linked to the security
    const [portfolio] = await PortfolioService.findByFields({ filters: { securityId } });

    // If selling and portfolio doesn't exist, throw an error
    if (!portfolio && tradeType === constants.tradeType.sell) {
      throw portfolioNotFoundError();
    }

    // If selling and insufficient shares, throw an error
    if (tradeType === constants.tradeType.sell && portfolio.shares < quantity) {
      throw insufficientQuantityError();
    }

    // Create transaction for atomic operations
    const db = knex(knexConfig);
    txn = await db.transaction();

    let tradeId = null;
    if (tradeType === constants.tradeType.buy) {
      if (portfolio) {
        // Update the portfolio for a BUY trade
        const { averageBuyPrice, shares: portfolioShares } = portfolio;
        const updatedShares = portfolioShares + quantity;
        const totalPrice = averageBuyPrice * portfolioShares + price * quantity;
        const newAverageBuyPrice = totalPrice / updatedShares;

        // Update portfolio in the database
        await PortfolioService.update({
          id: portfolio.id,
          data: { averageBuyPrice: newAverageBuyPrice, shares: updatedShares },
          txn
        });
      } else {
        // If portfolio does not exist, create a new portfolio entry
        const portfolioData = {
          securityId,
          averageBuyPrice: price / quantity,  // Calculate average buy price
          shares: quantity,
        };

        // Create a new portfolio entry
        await PortfolioService.create({ data: portfolioData, txn });
      }

      // Record the BUY trade
      const trade = {
        tradeType: constants.tradeType.buy,
        securityId,
        price,
        shares: quantity,
      };

      const createdTrade = await TradeService.create({ data: trade, txn });
      tradeId = createdTrade.id;
    } else if (tradeType === constants.tradeType.sell) {
      // Update the portfolio for a SELL trade
      const { shares: portfolioShares } = portfolio;
      const updatedShares = portfolioShares - quantity;

      // Ensure the new quantity doesn't go below 0
      if (updatedShares < 0) {
        throw insufficientQuantityError();
      }

      // Update portfolio shares
      await PortfolioService.update({
        id: portfolio.id,
        data: { shares: updatedShares },
        txn
      });

      // Record the SELL trade
      const trade = {
        tradeType: constants.tradeType.sell,
        securityId,
        price,
        shares: quantity,
      };

      const createdTrade = await TradeService.create({ data: trade, txn });
      tradeId = createdTrade.id;
    }

    // Commit the transaction if all operations succeed
    await txn.commit();
    return res.status(201).json({
      status: "success",
      data: {
        tradeId,
      }
    });
  } catch (err) {
    if (txn) {
      await txn.rollback();  // Rollback in case of any errors
    }
    return handleError(err, res);  // Handle and return the error response
  }
};

export const updateTrade = async (req, res) => {
  let txn = null;
  try {
    // Validate request body schema 
    const bodyValidationError = validateSchema(tradeUpdationPayloadSchema, req.body, res);
    if (bodyValidationError) return bodyValidationError;

    // Validate request params schema
    const paramValidationError = validateSchema(idSchema, req.params, res);
    if (paramValidationError) return paramValidationError;

    const { id: tradeId } = req.params;
    let { price, quantity } = req.body;

    // Fetch existing trade
    const existingTrade = await TradeService.getTradeById({ id: tradeId });
    if (!existingTrade) {
      throw tradeNotFoundError();
    }

    const { tradeType, securityId, shares: oldQuantity, price: oldPrice } = existingTrade;

    // Fetch portfolio linked to the security
    const [portfolio] = await PortfolioService.findByFields({ filters: { securityId } });
    if (!portfolio) {
      throw portfolioNotFoundError();
    }

    const db = knex(knexConfig);
    txn = await db.transaction();

    price = price || oldPrice;
    quantity = quantity || oldQuantity;

    if (tradeType === constants.tradeType.buy) {
      const { averageBuyPrice, shares: portfolioShares } = portfolio;
      const updatedShares = portfolioShares - oldQuantity + quantity;
      const totalPrice = averageBuyPrice * portfolioShares - oldPrice * oldQuantity + price * quantity;
      const newAverageBuyPrice = updatedShares > 0 ? totalPrice / updatedShares : 0;

      if (updatedShares === 0) {
        await PortfolioService.delete({ id: portfolio.id, txn });
      } else {
        await PortfolioService.update({
          id: portfolio.id,
          data: { averageBuyPrice: newAverageBuyPrice, shares: updatedShares },
          txn,
        });
      }
    } else if (tradeType === constants.tradeType.sell) {
      const updatedShares = portfolio.shares + oldQuantity - quantity;
      if (updatedShares < 0) {
        throw insufficientQuantityError();
      }

      if (updatedShares === 0) {
        await PortfolioService.deleteById({ id: portfolio.id, txn });
      } else {
        await PortfolioService.update({
          id: portfolio.id,
          data: { shares: updatedShares },
          txn,
        });
      }
    }

    await TradeService.update({ id: tradeId, data: { price, shares: quantity }, txn });
    await txn.commit();
    return res.status(200).json({ status: "success", data: {} });
  } catch (err) {
    if (txn) await txn.rollback();
    return handleError(err, res);
  }
};

export const deleteTrade = async (req, res) => {
  let txn = null;
  try {
    const paramValidationError = validateSchema(idSchema, req.params, res);
    if (paramValidationError) return paramValidationError;

    const { id: tradeId } = req.params;
    const existingTrade = await TradeService.getTradeById({ id: tradeId });
    if (!existingTrade) {
      throw tradeNotFoundError(tradeId);
    }

    const { tradeType, securityId, shares: oldQuantity, price: oldPrice } = existingTrade;
    const [portfolio] = await PortfolioService.findByFields({ filters: { securityId } });
    if (!portfolio) {
      throw portfolioNotFoundError();
    }

    const db = knex(knexConfig);
    txn = await db.transaction();

    if (tradeType === constants.tradeType.buy) {
      const { averageBuyPrice, shares: portfolioShares } = portfolio;
      const updatedShares = portfolioShares - oldQuantity;
      const totalPrice = averageBuyPrice * portfolioShares - oldPrice * oldQuantity;
      const newAverageBuyPrice = updatedShares > 0 ? totalPrice / updatedShares : 0;

      if (updatedShares === 0) {
        await PortfolioService.deleteById({ id: portfolio.id, txn });
      } else {
        await PortfolioService.update({
          id: portfolio.id,
          data: { averageBuyPrice: newAverageBuyPrice, shares: updatedShares },
          txn,
        });
      }
    } else if (tradeType === constants.tradeType.sell) {
      const updatedShares = portfolio.shares + oldQuantity;

      if (updatedShares === 0) {
        await PortfolioService.deleteById({ id: portfolio.id, txn });
      } else {
        await PortfolioService.update({
          id: portfolio.id,
          data: { shares: updatedShares },
          txn,
        });
      }
    }

    await TradeService.deleteById({ id: tradeId, txn });
    await txn.commit();
    return res.status(200).json({ status: "success", data: {} });
  } catch (err) {
    if (txn) await txn.rollback();
    return handleError(err, res);
  }
};


