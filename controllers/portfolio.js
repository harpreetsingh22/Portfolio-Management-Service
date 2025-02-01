

import { handleError } from '../utilities/error.js';
import { PortfolioService } from '../services/portfolio.js';
import preparePortfolioResponse from '../mappers/portfolio.js';
import constants from '../constants/index.js';

const { defaultPrice } = constants;

export const getPortfolio = async (req, res) => {
    try {
        const portfolio = await PortfolioService.getPortfolio({ embed: '[security]' });
        return res.status(200).json({
            status: "success", data: {
                portfolio: preparePortfolioResponse(portfolio)
            }
        });
    } catch (err) {
        return handleError(err, res);
    }
};

export const getPortfolioReturns = async (req, res) => {
    try {
        // Fetch all securities within the portfolio
        const portfolio = await PortfolioService.getPortfolio({});

        let cumulativeReturns = 0;

        for (const security of portfolio) {
            const { averageBuyPrice, shares } = security;
            cumulativeReturns += (defaultPrice - averageBuyPrice) * shares;
        }

        return res.status(200).json({ status: "success", data: { cumulativeReturns } });
    } catch (err) {
        return handleError(err, res);
    }
};

