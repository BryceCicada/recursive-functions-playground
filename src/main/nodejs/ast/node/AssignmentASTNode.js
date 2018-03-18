"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ASTNode_1 = require("./ASTNode");
class AssignmentASTNode extends ASTNode_1.ASTNode {
    constructor(variable, func) {
        super();
        this.variable = variable;
        this.func = func;
    }
    accept(visitor) {
        return visitor.visitAssignment(this);
    }
    toString() {
        return `${this.variable.toString()} = ${this.func.toString()}`;
    }
}
exports.AssignmentASTNode = AssignmentASTNode;
