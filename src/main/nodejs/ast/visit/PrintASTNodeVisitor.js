"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ASTNodeVisitor_1 = require("./ASTNodeVisitor");
class PrintASTNodeVisitor extends ASTNodeVisitor_1.ASTNodeVisitor {
    visitApplication(node) {
        return `${this.visit(node.func)}(${node.args.map(a => this.visit(a)).join(',')})`;
    }
    visitComposition(node) {
        return `${this.visit(node.func)}.(${node.args.map(a => this.visit(a)).join(',')})`;
    }
    visitSuccessor(node) {
        return 'S';
    }
    visitConst(node) {
        return `${node.number}`;
    }
    visitProjection(node) {
        return `P^${node.arity}_${node.index}`;
    }
    visitRecursion(node) {
        return `(${this.visit(node.base)}:${this.visit(node.recursion)})`;
    }
    makeString(expr, type) {
        return `${expr}: ${type}`;
    }
}
exports.PrintASTNodeVisitor = PrintASTNodeVisitor;
