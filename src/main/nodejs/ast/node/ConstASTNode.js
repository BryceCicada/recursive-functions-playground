"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ASTNode_1 = require("./ASTNode");
const Type_1 = require("../../type/Type");
class ConstASTNode extends ASTNode_1.ASTNode {
    constructor(number) {
        super();
        this.number = number;
    }
    accept(visitor) {
        return visitor.visitConst(this);
    }
    toString() {
        return `${this.number}`;
    }
    static from(number) {
        let r = new ConstASTNode(number);
        r.type = Type_1.constType;
        return r;
    }
}
exports.ConstASTNode = ConstASTNode;
