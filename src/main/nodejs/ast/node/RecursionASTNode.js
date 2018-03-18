"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ASTNode_1 = require("./ASTNode");
class RecursionASTNode extends ASTNode_1.ASTNode {
    constructor(base, recursion) {
        super();
        this.base = base;
        this.recursion = recursion;
    }
    accept(visitor) {
        return visitor.visitRecursion(this);
    }
    toString() {
        return `(${this.base.toString()}:${this.recursion.toString()})`;
    }
}
exports.RecursionASTNode = RecursionASTNode;
