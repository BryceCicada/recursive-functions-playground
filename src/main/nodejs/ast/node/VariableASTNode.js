"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ASTNode_1 = require("./ASTNode");
class VariableASTNode extends ASTNode_1.ASTNode {
    constructor(name) {
        super();
        this.name = name;
    }
    accept(visitor) {
        return visitor.visitVariable(this);
    }
    toString() {
        return this.name;
    }
}
exports.VariableASTNode = VariableASTNode;
