let ASTNodeVisitor = require('../node/ASTNodeVisitor');

class SemanticCheckASTNodeVisitor extends ASTNodeVisitor {
    constructor() {
        super();
    }

    visitConst(node) {
        return [];
    }

    visitSuccessor(node) {
        return [];
    }

    visitApplication(node) {
        let nodeErrs = [];
        if (node.func.arity !== node.args.length) {
            nodeErrs.push("Func has wrong number of arguments");
        }
        let funcErr = node.func.accept(this);
        let argErrs = node.args.map(arg => arg.accept(this));
        return nodeErrs.concat(funcErr, ...argErrs);
    }

    visitProjection(node) {
        let nodeErrs = [];
        if (node.index >= node.arity) {
            nodeErrs.push("Projection index must be less than arity");
        }
        return nodeErrs;
    }

    visitComposition(node) {
        let nodeErrs = [];
        if (node.func.arity !== node.args.length) {
            nodeErrs.push("Wrong number of arguments");
        }
        node.args
            .filter(arg => arg.arity !== node.args[0].arity)
            .forEach((arg,idx) => nodeErrs.push(`Argument ${idx} must have same arity as first`));
        let funcErr = node.func.accept(this);
        let argErrs = node.args.map(arg => arg.accept(this));
        return nodeErrs.concat(funcErr, ...argErrs);
    }

}

module.exports = SemanticCheckASTNodeVisitor;