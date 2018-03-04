"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ASTNodeVisitor_1 = require("./ASTNodeVisitor");
const ConstASTNode_1 = require("../node/ConstASTNode");
/**
 * Represents an error during evaluation of a parse tree as a
 * result of incorrect language implementation.
 */
class EvaluationError extends Error {
}
class EvaluatorASTNodeVisitor extends ASTNodeVisitor_1.ASTNodeVisitor {
    constructor() {
        super(...arguments);
        this.stack = [];
        this.apply = false;
        this.compose = false;
    }
    visitConst(node) {
        return node;
    }
    visitApplication(node) {
        this.stack.push(node.args.map(a => this.visit(a)));
        this.apply = true;
        let r = this.visit(node.func);
        this.apply = false;
        return r;
    }
    visitComposition(node) {
        if (this.apply) {
            let args = this.stack.pop();
            if (args) {
                let definedArgs = args;
                this.stack.push(node.args.map(nodeArg => {
                    this.stack.push(definedArgs);
                    return this.visit(nodeArg);
                }));
            }
            return this.visit(node.func);
        }
        else {
            return node;
        }
    }
    visitSuccessor(node) {
        if (this.apply) {
            let args = this.stack.pop();
            if (args) {
                // It's OK to cast args[0] to ConstASTNode here because our
                // semantic checks are performed already by our language's type system.
                return new ConstASTNode_1.ConstASTNode(args[0].number + 1);
            }
            else {
                throw new EvaluationError("Missing arguments for sucessor");
            }
        }
        else {
            return node;
        }
    }
    visitProjection(node) {
        if (this.apply || this.compose) {
            let args = this.stack.pop();
            if (args) {
                return args[node.index];
            }
            else {
                throw new EvaluationError("Missing arguments for application or composition");
            }
        }
        else {
            return node;
        }
    }
}
exports.EvaluatorASTNodeVisitor = EvaluatorASTNodeVisitor;
