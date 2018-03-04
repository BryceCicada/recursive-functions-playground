"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Type_1 = require("../../type/Type");
class ConstASTNode {
    constructor(number) {
        this.number = number;
        this.type = Type_1.constType;
    }
    accept(visitor) {
        return visitor.visitConst(this);
    }
}
exports.ConstASTNode = ConstASTNode;
