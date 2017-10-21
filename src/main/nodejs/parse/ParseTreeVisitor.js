let RecFunVisitor = require('../../../../target/src/main/antlr/RecFunVisitor');

let EmptyASTNode = require('../ast/node/EmptyASTNode');
let ConstASTNode = require('../ast/node/ConstASTNode');
let SuccessorASTNode = require('../ast/node/SuccessorASTNode');
let ProjectionASTNode = require('../ast/node/ProjectionASTNode');
let ApplicationASTNode = require('../ast/node/ApplicationASTNode');
let CompositionASTNode = require('../ast/node/CompositionASTNode');
let RecursionASTNode = require('../ast/node/RecursionASTNode');

class ParseTreeVisitor extends RecFunVisitor.RecFunVisitor {
    visitParse(ctx) {
        if (ctx.children.length <= 1) {
            return new EmptyASTNode();
        } else {
            return this.visit(ctx.children[0]);
        }
    }

    visitConst(ctx) {
        let number = parseInt(ctx.children[0].symbol.text, 10);
        return new ConstASTNode(number);
    }

    visitSuccessor(ctx) {
        return new SuccessorASTNode();
    }

    visitApplication(ctx) {
        let args = ctx.children
            .slice(2,-1)
            .filter((x,i) => i%2===0)
            .map(child => this.visit(child));
        let func = this.visit(ctx.children[0]);
        return new ApplicationASTNode(func, args);
    }

    visitProjection(ctx) {
        let arity = parseInt(ctx.children[1].symbol.text, 10);
        let index = parseInt(ctx.children[3].symbol.text, 10);
        return new ProjectionASTNode(arity, index);
    }

    visitComposition(ctx) {
        let args = ctx.children
            .slice(3,-1)
            .filter((x,i) => i%2===0)
            .map(child => this.visit(child));
        let func = this.visit(ctx.children[0]);
        return new CompositionASTNode(func, args);
    }

    visitRecursion(ctx) {
        let base = this.visit(ctx.children[0]);
        let recursion = this.visit(ctx.children[2]);
        return new RecursionASTNode(base, recursion);
    }

}

module.exports = ParseTreeVisitor;