let RecFunVisitor = require('../../../../target/src/main/antlr/RecFunVisitor');

let {VariableASTNode} = require('../ast/node/VariableASTNode');
let {ConstASTNode} = require('../ast/node/ConstASTNode');
let {SuccessorASTNode} = require('../ast/node/SuccessorASTNode');
let {ProjectionASTNode} = require('../ast/node/ProjectionASTNode');
let {ApplicationASTNode} = require('../ast/node/ApplicationASTNode');
let {CompositionASTNode} = require('../ast/node/CompositionASTNode');
let {RecursionASTNode} = require('../ast/node/RecursionASTNode');
let {BlockASTNode} = require('../ast/node/BlockASTNode');
let {AssignmentASTNode} = require('../ast/node/AssignmentASTNode');

class ParseTreeVisitor extends RecFunVisitor.RecFunVisitor {
    visitParse(ctx) {
        return this.visit(ctx.children[0]);
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
            .map(arg => this.visit(arg));
        let func = this.visit(ctx.children[0]);
        return new ApplicationASTNode(func, args);
    }

    visitProjection(ctx) {
        let arity = parseInt(ctx.children[2].symbol.text, 10);
        let index = parseInt(ctx.children[4].symbol.text, 10);
        return new ProjectionASTNode(arity, index);
    }

    visitComposition(ctx) {
        let args = ctx.children
            .slice(3,-1)
            .filter((x,i) => i%2===0)
            .map(arg => this.visit(arg));
        let func = this.visit(ctx.children[0]);
        return new CompositionASTNode(func, args);
    }

    visitRecursion(ctx) {
        let base = this.visit(ctx.children[0]);
        let recursion = this.visit(ctx.children[2]);
        return new RecursionASTNode(base, recursion);
    }

    visitBlock(ctx) {
        let assignments = ctx.children
            .slice(1,-2)
            .filter((x,i) => i%2===0)
            .map(assignment => this.visit(assignment));
        let func = this.visit(ctx.children.slice(-1)[0]);
        return new BlockASTNode(func, assignments);
    }

    visitAssignment(ctx) {
        let variable = new VariableASTNode(ctx.children[0].symbol.text);
        let func = this.visit(ctx.children[2]);
        return new AssignmentASTNode(variable, func);
    }

    visitVariable(ctx) {
        return new VariableASTNode(ctx.children[0].symbol.text);
    }
}


module.exports = ParseTreeVisitor;