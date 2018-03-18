"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ASTNode_1 = require("./ASTNode");
class ProjectionASTNode extends ASTNode_1.ASTNode {
    constructor(arity, index) {
        super();
        this.arity = arity;
        this.index = index;
    }
    accept(visitor) {
        return visitor.visitProjection(this);
    }
    toString() {
        return `P^${this.arity}_${this.index}`;
    }
}
exports.ProjectionASTNode = ProjectionASTNode;
