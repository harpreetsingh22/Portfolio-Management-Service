import { Model } from 'objection'; 
import Security from './security.js';
import Joi from 'joi';
import Constants from '../constants/index.js';

class Trade extends Model {
    static get tableName() {
        return Constants.tableName.trade;
    }

    static get idColumn() {
        return 'id';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().positive().integer().required(),
            securityId: Joi.number().positive().integer().required(),
            tradeType: Joi.string().valid(Constants.tradeType.buy, Constants.tradeType.sell).required(),
            price: Joi.number().positive().integer().required(),
            shares: Joi.number().positive().integer().required(),
            createdAt: Joi.date().iso().required(),
            updatedAt: Joi.date().iso().required(),
        });
    }

    static get relationMappings() {
        return {
            security: {
                relation: Model.HasOneRelation,
                modelClass: Security,
                join: {
                    from: 'trade.securityId',
                    to: 'security.id',
                },
            },
        };
    }
}

export default Trade;

