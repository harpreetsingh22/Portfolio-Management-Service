import Boom from '@hapi/boom';

export const handleError = (err, res) => {
    if (Boom.isBoom(err)) {
        console.log("err", typeof err.output.payload.message);
        const { statusCode, payload } = err.output;
        if (payload && payload.message) {
            if (typeof payload.message === 'object') {
                payload.message = JSON.stringify(payload.message);
            }
        }
        console.error("Error Payload:", JSON.stringify(payload, null, 2));
        return res.status(statusCode).json(payload);
    }
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
};

export const portfolioNotFoundError = () => Boom.notFound(JSON.stringify({
    error_code: 'PortfolioNotFoundError',
    error_description: 'Portfolio not found for the given security. You cannot sell this security.',
}));

export const insufficientQuantityError = () => Boom.forbidden(JSON.stringify({
    error_code: 'InsufficientQuantityError',
    error_description: 'Insufficient quantity in the portfolio to complete the sell transaction.',
}));

export const securityNotFoundError = () => Boom.notFound(JSON.stringify({
    error_code: 'PortfolioNotFoundError',
    error_description: 'Portfolio not found for the given security. You cannot sell this security.',
}));

export const tradeNotFoundError = (id) => Boom.notFound(JSON.stringify({
    error_code: 'tradeNotFoundError',
    error_description: `No trade found with the given id = ${id}`,
}));