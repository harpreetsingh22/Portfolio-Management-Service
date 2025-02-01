import { SecurityRepository } from './repositories/security.js';

export class SecurityService {
    static async create({ data, txn }) {
        return await SecurityRepository.create({ data, txn });
    }

    static async getSecurityById({ id, txn, embed }) {
        return await SecurityRepository.findById({ id, txn, embed });
    }
}

