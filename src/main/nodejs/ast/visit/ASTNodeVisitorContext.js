"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidContextError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.InvalidContextError = InvalidContextError;
class ASTNodeVisitorContext {
    constructor() {
        this.outer = null;
        this.context = new Map();
    }
    get(variable) {
        for (let c = this; c != null; c = c.outer) {
            let v = c.context.get(variable.name);
            if (v !== undefined)
                return v;
        }
        return null;
    }
    set(variable, value) {
        this.context.set(variable.name, value);
        return this;
    }
    push() {
        let c = new ASTNodeVisitorContext();
        c.outer = this;
        return c;
    }
    pop() {
        if (this.outer === null) {
            throw new InvalidContextError("Unable to pop context.  Already at root context");
        }
        return this.outer;
    }
}
exports.ASTNodeVisitorContext = ASTNodeVisitorContext;
