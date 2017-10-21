let ASTNode = require('./ASTNode');
class EmptyASTNode extends ASTNode {
    constructor() {
        super();
    }
    get [Symbol.toStringTag]() {
        return 'EmptyASTNode';
    }


}
module.exports = EmptyASTNode;