"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ASTNode_1 = require("./ASTNode");
class BlockASTNode extends ASTNode_1.ASTNode {
    constructor(func, assignments) {
        super();
        this.func = func;
        this.assignments = assignments;
    }
    accept(visitor) {
        return visitor.visitBlock(this);
    }
    toString() {
        return `let ${this.assignments.map(a => a.toString()).join(',')} in ${this.func}`;
    }
}
exports.BlockASTNode = BlockASTNode;
