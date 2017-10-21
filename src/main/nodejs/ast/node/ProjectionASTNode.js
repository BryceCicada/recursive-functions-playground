let ASTNode = require('./ASTNode');
class ProjectionASTNode extends ASTNode {
    constructor(arity, index) {
        super();
        this.index = index;
        this.arity = arity;
    }

    accept(visitor) {
        return visitor.visitProjection(this);
    }

    get [Symbol.toStringTag]() {
        return 'ProjectionASTNode';
    }
}
module.exports = ProjectionASTNode;