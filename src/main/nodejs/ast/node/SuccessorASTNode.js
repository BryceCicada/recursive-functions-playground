"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ASTNode_1 = require("./ASTNode");
class SuccessorASTNode extends ASTNode_1.ASTNode {
    accept(visitor) {
        return visitor.visitSuccessor(this);
    }
    toString() {
        return 'S';
    }
}
exports.SuccessorASTNode = SuccessorASTNode;
