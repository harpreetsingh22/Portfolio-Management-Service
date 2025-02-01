import Portfolio from '../../models/portfolio.js';
import { handleError } from '../../utilities/error.js';

export class PortfolioRepository {
  static async create({ data, txn = null }) {
    try {
      return await Portfolio.query(txn).insert(data);
    } catch (error) {
      throw handleError(error);
    }
  }

  static async getAllRecords({ embed = null, txn = null }) {
    try {
      let query = Portfolio.query(txn);

      if (embed) {
        query.withGraphFetched(embed);
      };

      const result = await query;
      return result;
    } catch (error) {
      throw handleError(error);
    }
  }

  static async update({ id, data, txn = null }) {
    try {
      return await Portfolio.query(txn)
        .patchAndFetchById(id, data);
    } catch (error) {
      throw handleError(error);
    }
  }

  static async findByFields({ filters = {}, txn = null, embed = null }) {
    try {
      let query = Portfolio.query(txn)

      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          query.where(key, filters[key]);
        }
      });

      if (embed) {
        query.withGraphFetched(embed);
      };

      const result = await query;
      return result;
    } catch (error) {
      throw handleError(error);
    }
  }

  static async deleteById({ id, txn = null }) {
    try {
        await Portfolio.query(txn).deleteById(id);
    } catch (error) {
        throw handleError(error);
    }
}
}