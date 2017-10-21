let ASTNodeVisitor = require('../node/ASTNodeVisitor');
let ConstASTNode = require('../node/ConstASTNode');

class EvaluatorASTNodeVisitor extends ASTNodeVisitor {
    constructor() {
        super();
        this.stack = [];
        this.apply = false;
        this.compose = false;
    }

    visitConst(node) {
        return node;
    }

    visitApplication(node) {
        this.stack.push(node.args.map(arg => arg.accept(this)));
        this.apply = true;
        let r = node.func.accept(this);
        this.apply = false;
        return r;
    }

    visitComposition(node) {
        if (this.apply) {
            let args = this.stack.pop();
            this.stack.push(node.args.map(arg => {
               this.stack.push(args);
               return arg.accept(this);
            }));
            return node.func.accept(this);
        } else {
            return node;
        }
    }

    visitSuccessor(node) {
        if (this.apply) {
            let args = this.stack.pop();
            return new ConstASTNode(args[0].number+1);
        } else {
            return node;
        }
    }

    visitProjection(node) {
        if (this.apply || this.compose) {
            let args = this.stack.pop();
            return args[node.index];
        } else {
            return node;
        }
    }

}

module.exports = EvaluatorASTNodeVisitor;