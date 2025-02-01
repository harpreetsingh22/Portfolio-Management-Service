// security-repository.js

import Security from '../../models/security.js'; // Assuming you have the Security model defined
import { handleError } from '../../utilities/error.js';

export class SecurityRepository {
    // // Create a new security record
    static async create({ data, txn = null }) {
        try {
            return await Security.query(txn).insert(data);
        } catch (error) {
            throw handleError(error);
        }
    }

    // Find a security record by ID
    static async findById({ id, txn = null }) {
        try {
            ;
            return await Security.query(txn).findById(id);
        } catch (error) {
            throw handleError(error);
        }
    }

}