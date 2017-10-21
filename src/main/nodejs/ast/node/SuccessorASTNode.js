let ASTNode = require('./ASTNode');
class SuccessorASTNode extends ASTNode {
    constructor() {
        super();
        this.arity = 1;
    }

    accept(visitor) {
        return visitor.visitSuccessor(this);
    }

    get [Symbol.toStringTag]() {
        return 'SuccessorASTNode';
    }
}
module.exports = SuccessorASTNode;