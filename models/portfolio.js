import { Model } from 'objection';
import { knexInstance } from '../knexfile.js';  
import Security from './security.js';
import Joi from 'joi';
import Constants from '../constants/index.js';

class Portfolio extends Model {
    static get tableName() {
        return Constants.tableName.portfolio;
    }

    static get idColumn() {
        return 'id';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().required(),
            securityId: Joi.number().required(),
            averageBuyPrice: Joi.number().positive().required(),
            shares: Joi.number().positive().required(),
            createdAt: Joi.date().iso(),
            updatedAt: Joi.date().iso(),
        });
    }

    static get relationMappings() {
        return {
            security: {
                relation: Model.HasOneRelation,
                modelClass: Security,
                join: {
                    from: 'portfolio.securityId',
                    to: 'security.id',
                },
            },
        };
    }
}

Model.knex(knexInstance);
export default Portfolio;

