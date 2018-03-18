"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ASTNodeVisitorContext_1 = require("./ASTNodeVisitorContext");
const Type_1 = require("../../type/Type");
class ASTNodeVisitor {
    constructor() {
        this.context = new ASTNodeVisitorContext_1.ASTNodeVisitorContext();
    }
    visit(node) {
        return node.accept(this);
    }
    visitProjection(node) {
        throw new Error("visitProjection: Method not implemented.");
    }
    visitSuccessor(node) {
        throw new Error("visitSuccessor: Method not implemented.");
    }
    visitComposition(node) {
        throw new Error("visitComposition: Method not implemented.");
    }
    visitApplication(node) {
        throw new Error("visitApplication: Method not implemented.");
    }
    visitConst(node) {
        throw new Error("visitConst: Method not implemented.");
    }
    visitRecursion(node) {
        throw new Error("visitRecursion: Method not implemented.");
    }
    visitAssignment(node) {
        let func = this.visit(node.func);
        this.context.set(node.variable, func);
        return func;
    }
    visitBlock(node) {
        this.context = this.context.push();
        for (let assignment of node.assignments) {
            // Populate the context
            this.visit(assignment);
        }
        let r = this.visit(node.func);
        this.context = this.context.pop();
        return r;
    }
    visitVariable(node) {
        let func = this.context.get(node);
        if (!func) {
            throw new Type_1.StaticTypeError(`No such variable ${node.name}`);
        }
        return func;
    }
}
exports.ASTNodeVisitor = ASTNodeVisitor;
