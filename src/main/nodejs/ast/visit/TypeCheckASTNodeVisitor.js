"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ASTNodeVisitor_1 = require("./ASTNodeVisitor");
const Type_1 = require("../../type/Type");
class TypeCheckFailure {
    constructor(message) {
        this.message = message;
    }
}
exports.TypeCheckFailure = TypeCheckFailure;
class TypeCheckASTNodeVisitor extends ASTNodeVisitor_1.ASTNodeVisitor {
    visitConst(node) {
        return [];
    }
    visitSuccessor(node) {
        return [];
    }
    visitApplication(node) {
        let nodeErrs = [];
        let funcErr = this.visit(node.func);
        let argErrs = node.args.map(arg => this.visit(arg));
        nodeErrs.concat(funcErr, ...argErrs);
        try {
            node.type;
        }
        catch (e) {
            if (e instanceof Type_1.StaticTypeError) {
                nodeErrs.push(new TypeCheckFailure(e.message));
            }
            else {
                throw e;
            }
        }
        return nodeErrs;
    }
    visitProjection(node) {
        let nodeErrs = [];
        try {
            node.type;
        }
        catch (e) {
            if (e instanceof Type_1.StaticTypeError) {
                nodeErrs.push(new TypeCheckFailure(e.message));
            }
            else {
                throw e;
            }
        }
        return nodeErrs;
    }
    visitComposition(node) {
        let nodeErrs = [];
        let funcErr = this.visit(node.func);
        let argErrs = node.args.map(arg => this.visit(arg));
        nodeErrs.concat(funcErr, ...argErrs);
        try {
            node.type;
        }
        catch (e) {
            if (e instanceof Type_1.StaticTypeError) {
                nodeErrs.push(new TypeCheckFailure(e.message));
            }
            else {
                throw e;
            }
        }
        return nodeErrs;
    }
}
exports.TypeCheckASTNodeVisitor = TypeCheckASTNodeVisitor;
