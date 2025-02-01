# Portfolio Management Service API

## Overview

This API provides the functionality for managing trade transactions, such as creating, updating, retrieving, and deleting trades. It integrates with portfolios and securities and ensures that business rules around buying and selling are enforced.

## API Endpoints

### 1. Create a Trade

**POST** `/api/trades`

Creates a new trade transaction. This API supports both `buy` and `sell` trade types.

#### Request Body

```json
{
  "tradeType": "buy" | "sell",      // Type of trade (buy or sell)
  "securityId": "number",             // ID of the security being traded
  "price": "number",                // Price per share
  "quantity": "number"              // Number of shares to trade
}
```

#### Response
##### Success (201 OK)
```
{
  "status": "success",
  "data": 
    {
      "id": "tradeId",
    },
}
```
### 2. Update a Trade

**PATCH** `/api/trades/:id`

Updates an existing trade transaction and portfolio. This API allows partial updates for a trade, such as modifying the price or quantity of shares for a given trade.

#### URL Parameters

- `id` (required): The id of the trade to be updated.

#### Request Body

```json
{
  "price": "number",       // (Optional) New price per share for the trade
  "quantity": "number"     // (Optional) New quantity of shares for the trade
}
```

### 3. Delete a Trade

**DELETE** `/api/trades/:id`

Deletes an existing trade transaction. This API removes a trade and updates the associated portfolio accordingly.

#### URL Parameters

- `id` (required): The unique identifier of the trade to be deleted.

#### Response

##### Success (200 OK)

```json
{
  "status": "success",
  "message": "Trade deleted successfully"
}
```

### 4. Get Trades

**GET** `/api/trades`

Retrieves a list of trades based on the specified trade type and security ID. This API can be used to filter trades by their type (buy/sell) and the security associated with them.

#### Query Parameters

- `tradeType` (optional): The type of trade to filter by. Possible values are `buy` and `sell`.
- `securityId` (optional): The ID of the security associated with the trade.

##### Success (200 OK)
```
{
  "status": "success",
  "data": 
    {
        "results": [
        {
            "id": 1,
            "securityId": 1,
            "tickerSymbol": "tcs",
            "name": "tata",
            "tradeType": "SELL",
            "price": 100,
            "quantity": 1,
            "createdAt": "2025-01-31T12:26:16.000Z",
            "updatedAt": "2025-01-31T12:26:16.000Z"
        }
    ],
    "total": 1,
    "totalPages": 1,
    "currentPage": 1,
    "pageSize": 10
    },
}
```
### 5. Get Portfolio Details

**GET** `/api/portfolio`

Retrieves the portfolio details, such as the securities within the portfolio and their current prices.

##### Success (200 OK)
```
{
    "status": "success",
    "data": {
        "portfolio": [
            {
                "averageBuyPrice": 10,
                "shares": 10,
                "tickerSymbol": "tcs",
                "securityId": 1,
                "name": "tata"
            },
            {
                "averageBuyPrice": 10,
                "shares": 40,
                "tickerSymbol": "wip",
                "securityId": 2,
                "name": "wipro"
            }
        ]
    }
}
```


### 6. Get Portfolio Returns

**GET** `/api/portfolio/returns`

Retrieves the Portfolio Returns

##### Success (200 OK)
```
{
    "status": "success",
    "data": {
        "cumulativeReturns": 3600
    }
}
```      
 
