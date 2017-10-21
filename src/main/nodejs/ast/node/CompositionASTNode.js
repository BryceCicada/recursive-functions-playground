let ASTNode = require('./ASTNode');
class CompositionASTNode extends ASTNode {
    constructor(func, args) {
        super();
        this.func = func;
        this.args = args;
        this.arity = args && args.length > 0 ? args[0].arity : 0;
    }

    accept(visitor) {
        return visitor.visitComposition(this);
    }

    get [Symbol.toStringTag]() {
        return 'CompositionASTNode';
    }
}
module.exports = CompositionASTNode;