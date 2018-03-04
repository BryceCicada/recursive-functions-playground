"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RecursionASTNode {
    constructor(base, recursion) {
        this.base = base;
        this.recursion = recursion;
        this.type = base.type;
    }
    accept(visitor) {
        return visitor.visitRecursion(this);
    }
}
exports.RecursionASTNode = RecursionASTNode;
