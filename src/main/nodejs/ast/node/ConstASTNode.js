let ASTNode = require('./ASTNode');
class ConstASTNode extends ASTNode {
    constructor(number) {
        super();
        this.number = number;
        this.arity = 0;
    }

    accept(visitor) {
        return visitor.visitConst(this);
    }

    get [Symbol.toStringTag]() {
        return 'ConstASTNode';
    }

}
module.exports = ConstASTNode;