import { Model } from 'objection';
import Joi from 'joi';
import Constants from '../constants/index.js';
import knexInstance from '../knexfile.js';

class Security extends Model {
    static get tableName() {
        return Constants.tableName.security;
    }

    static get idColumn() {
        return 'id';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().positive().integer().required(),
            tickerSymbol: Joi.string().required(),
            name: Joi.string().required(),
            createdAt: Joi.date().iso().required(),
            updatedAt: Joi.date().iso().required(),
        });
    }
}

Model.knex(knexInstance);
export default Security;

