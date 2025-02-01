function preparePortfolioResponse(portfolio){
    return portfolio.map((record)=>{
        const { averageBuyPrice, shares, security, securityId } = record;
        const { tickerSymbol, name } = security;
        return {
            averageBuyPrice,
            shares,
            tickerSymbol,
            securityId,
            name,
        }
    })
}

export default preparePortfolioResponse;
