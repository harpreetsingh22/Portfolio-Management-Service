import Joi from 'joi';
import constants from '../../constants/index.js'


const { tradeType } = constants;

export const getTradesQueryParamsFilterSchema = Joi.object({
    tradeType: Joi.string().valid(tradeType.buy,tradeType.sell),
    securityId: Joi.number().positive().optional(),
    page: Joi.number().integer().min(0).default(0).optional(),  
    limit: Joi.number().integer().min(1).default(10).optional(),
});

export const tradeCreationPayloadSchema = Joi.object({
    tradeType: Joi.string().valid(tradeType.buy,tradeType.sell).required(),
    securityId: Joi.number().required(),
    quantity: Joi.number().positive().required(),
    price: Joi.number().positive().required(),
});

export const tradeUpdationPayloadSchema = Joi.object({
    quantity: Joi.number().positive(),
    price: Joi.number().positive(),
}).min(1);