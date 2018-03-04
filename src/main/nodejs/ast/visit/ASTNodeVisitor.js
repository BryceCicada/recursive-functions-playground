"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ASTNodeVisitor {
    visit(node) {
        return node.accept(this);
    }
    visitProjection(node) {
        throw new Error("Method not implemented.");
    }
    visitSuccessor(node) {
        throw new Error("Method not implemented.");
    }
    visitComposition(node) {
        throw new Error("Method not implemented.");
    }
    visitApplication(node) {
        throw new Error("Method not implemented.");
    }
    visitConst(node) {
        throw new Error("Method not implemented.");
    }
    visitRecursion(node) {
        throw new Error("Method not implemented.");
    }
}
exports.ASTNodeVisitor = ASTNodeVisitor;
