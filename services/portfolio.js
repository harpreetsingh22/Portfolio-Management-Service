import { PortfolioRepository } from './repositories/portfolio.js';

export class PortfolioService {
  static async create({ data, txn }) {
    return await PortfolioRepository.create({ data, txn });
  }

  static async getPortfolio({ embed }) {
    return await PortfolioRepository.getAllRecords({ embed });
  }

  static async findByFields({ filters, txn, embed }) {
    return await PortfolioRepository.findByFields({ filters, txn, embed });
  }

  static async update({ id, data, txn }) {
    return await PortfolioRepository.update({ id, data, txn });
  }

}

