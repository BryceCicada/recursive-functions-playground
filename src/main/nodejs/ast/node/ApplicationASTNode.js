"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ASTNode_1 = require("./ASTNode");
class ApplicationASTNode extends ASTNode_1.ASTNode {
    constructor(func, args) {
        super();
        this.func = func;
        this.args = args;
    }
    accept(visitor) {
        return visitor.visitApplication(this);
    }
    toString() {
        return `${this.func.toString()}(${this.args.map(a => a.toString()).join(',')})`;
    }
}
exports.ApplicationASTNode = ApplicationASTNode;
