let ASTNode = require('./ASTNode');
class ApplicationASTNode extends ASTNode {
    constructor(func, args) {
        super();
        this.func = func;
        this.args = args;
        this.arity = 0;
    }

    accept(visitor) {
        return visitor.visitApplication(this);
    }

    get [Symbol.toStringTag]() {
        return 'RecursionASTNode';
    }
}
module.exports = ApplicationASTNode;