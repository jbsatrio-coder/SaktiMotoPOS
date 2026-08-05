/**
 * ============================================
 * Inventory Exception
 * Version : 1.0
 * ============================================
 */
class InventoryException extends Error {

    constructor(code, message, details = null) {

        super(message);

        this.name = "InventoryException";

        this.code = code;

        this.details = details;

        this.timestamp = new Date();

    }

    toString() {

        return "[" + this.code + "] " + this.message;

    }

}