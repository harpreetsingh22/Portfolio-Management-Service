import Trade from '../../models/trade.js';
import { handleError } from '../../utilities/error.js';

export class TradeRepository {
    static async create({ data, txn = null }) {
        try {
            return await Trade.query(txn).insert(data);
        } catch (error) {
            throw handleError(error);
        }
    }

    static async findById({ id, txn = null, embed }) {
        try {
            let query = Trade.query(txn).findById(id);
            if (embed) {
                query.withGraphFetched(embed);
            }
            return query;
        } catch (error) {
            throw handleError(error);
        }
    }

    static async findByFields({ filters = {}, txn = null, embed = null, page = 0, limit = 10 }) {
        try {
            let query = Trade.query(txn)

            Object.keys(filters).forEach((key) => {
                if (filters[key]) {
                    query.where(key, filters[key]);
                }
            });

            if (embed) {
                query.withGraphFetched(embed);
            };

            if (limit) {
                query.page(page, limit);
            };

            const result = await query;
            return result;
        } catch (error) {
            throw handleError(error);
        }
    }

    static async deleteById({ id, txn = null }) {
        try {
            await Trade.query(txn).deleteById(id);
        } catch (error) {
            throw handleError(error);
        }
    }

    static async update({ id, data, txn = null }) {
        try {
            return await Trade.query(txn)
                .patchAndFetchById(id, data);
        } catch (error) {
            throw handleError(error);
        }
    }

}