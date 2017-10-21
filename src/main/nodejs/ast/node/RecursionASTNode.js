let ASTNode = require('./ASTNode');
class RecursionASTNode extends ASTNode {
    constructor(base, recursion) {
        super();
        this.base = base;
        this.recursion = recursion;
        this.arity = 0;
    }
    get [Symbol.toStringTag]() {
        return 'RecursionASTNode';
    }
}
module.exports = RecursionASTNode;