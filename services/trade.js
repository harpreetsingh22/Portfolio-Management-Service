import { TradeRepository } from './repositories/trade.js';

export class TradeService {
  static async create({ data, txn }) {
    return await TradeRepository.create({ data, txn  });
  }

  static async getTradeById({id, txn ,embed}) {
    return await TradeRepository.findById({id,txn, embed});
  }

  static async getTrades({ filters, txn , embed , page, limit }) {
    return await TradeRepository.findByFields({filters, txn , embed , page, limit});
  }

  static async deleteById({ id, txn }) {
    return await TradeRepository.deleteById({id, txn });
  }

  static async update({ id, data, txn }) {
    return await TradeRepository.update({ id, data, txn });
  }

}

