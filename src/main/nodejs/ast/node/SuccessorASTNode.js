"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Type_1 = require("../../type/Type");
class SuccessorASTNode {
    constructor() {
        this.type = Type_1.functionType(Type_1.constType, Type_1.constType);
    }
    accept(visitor) {
        return visitor.visitSuccessor(this);
    }
}
exports.SuccessorASTNode = SuccessorASTNode;
