function prepareTradeResponse(trade){
    const { id, securityId, tradeType, price, quantity, security, createdAt, updatedAt } = trade;
    const { tickerSymbol, name } = security;
    return {
        id,
        securityId,
        tickerSymbol,
        name,
        tradeType,
        price, 
        quantity, 
        createdAt, 
        updatedAt
    }
}

export default prepareTradeResponse;