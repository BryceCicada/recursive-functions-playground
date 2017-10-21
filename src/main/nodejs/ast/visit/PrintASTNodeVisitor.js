let ASTNodeVisitor = require('../node/ASTNodeVisitor');
let ConstASTNode = require('../node/ConstASTNode');

class EvaluatorASTNodeVisitor extends ASTNodeVisitor {
    constructor() {
        super();
    }

    visitConst(node) {
        return this.astNodeToString(node.number, '*');
    }

    visitApplication(node) {
        let func = node.func.accept(this);
        let args = node.args.map(arg => arg.accept(this));
        return `${func}(${args.join(',')})`;
    }

    visitSuccessor(node) {
        return this.astNodeToString('S', '*', '*');
    }

    visitProjection(node) {
        let fromType = Array(node.arity).fill('*').join(',');
        if (node.arity > 1) {
            fromType = `(` + fromType + `)`;
        }
        return this.astNodeToString(`P^${node.arity}_${node.index}`, '*', fromType);
    }


    astNodeToString(val, toType, fromType = null) {
        if (fromType) {
            return `${val}: ${fromType} -> ${toType}`;
        } else {
            return `${val}: ${toType}`;
        }
    }
}

module.exports = EvaluatorASTNodeVisitor;