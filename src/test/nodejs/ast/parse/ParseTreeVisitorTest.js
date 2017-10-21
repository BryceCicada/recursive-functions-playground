let chai = require('chai');
let expect = chai.expect;

let Evaluator = require('../../../../main/nodejs/Evaluator');
let ParseTreeVisitor = require('../../../../main/nodejs/parse/ParseTreeVisitor');

describe('ParseTreeVisitor', function () {
    it('should be defined', function () {
        new ParseTreeVisitor();
    });
    
    describe('ast()', function () {
        let parseTreeVistor = new ParseTreeVisitor();
        
        it('should convert empty string to empty node', function () {
            let ast = parseTreeVistor.visit(Evaluator.concreteSyntaxTree(''));
            expect(ast).to.be.a('EmptyASTNode');
        });

        it('should convert 0 to const node', function () {
            let ast = parseTreeVistor.visit(Evaluator.concreteSyntaxTree('0'));
            expect(ast).to.be.a('ConstASTNode');
            expect(ast.arity).to.equal(0);
            expect(ast.number).to.equal(0);
        });

        it('should convert 1 to const node', function () {
            let ast = parseTreeVistor.visit(Evaluator.concreteSyntaxTree('1'));
            expect(ast).to.be.a('ConstASTNode');
            expect(ast.arity).to.equal(0);
            expect(ast.number).to.equal(1);
        });

        it('should convert S to successor node', function () {
            let ast = parseTreeVistor.visit(Evaluator.concreteSyntaxTree('S'));
            expect(ast).to.be.a('SuccessorASTNode');
        });

        it('should convert P^1_0 to projection node', function () {
            let ast = parseTreeVistor.visit(Evaluator.concreteSyntaxTree('P^1_0'));
            expect(ast).to.be.a('ProjectionASTNode');
            expect(ast.index).to.eql(0);
            expect(ast.arity).to.eql(1);
        });

        it('should convert S(0) to application node', function () {
            let ast = parseTreeVistor.visit(Evaluator.concreteSyntaxTree('S(0)'));
            expect(ast).to.be.a('RecursionASTNode');
            expect(ast.func).to.be.a('SuccessorASTNode');
            expect(ast.args.length).to.equal(1);
            expect(ast.args[0]).to.be.a('ConstASTNode');
            expect(ast.args[0].number).to.equal(0);

        });

        it('should convert P^1_0(0) to application node', function () {
            let ast = parseTreeVistor.visit(Evaluator.concreteSyntaxTree('P^1_0(0)'));
            expect(ast).to.be.a('RecursionASTNode');
            expect(ast.func).to.be.a('ProjectionASTNode');
            expect(ast.func.arity).to.eql(1);
            expect(ast.args.length).to.eql(1);
            expect(ast.args[0]).to.be.a('ConstASTNode');
            expect(ast.args[0].number).to.equal(0);
        });

        it('should convert S(S(0)) to application node', function () {
            let ast = parseTreeVistor.visit(Evaluator.concreteSyntaxTree('S(S(0))'));
            expect(ast).to.be.a('RecursionASTNode');
            expect(ast.func).to.be.a('SuccessorASTNode');
            expect(ast.func.arity).to.eql(1);
            expect(ast.args.length).to.equal(1);
            expect(ast.args[0]).to.be.a('RecursionASTNode');
            expect(ast.args[0].func).to.be.a('SuccessorASTNode');
            expect(ast.args[0].args.length).to.equal(1);
            expect(ast.args[0].args[0]).to.be.a('ConstASTNode');
            expect(ast.args[0].args[0].number).to.equal(0);
        });

        it('should convert P^2_1(0,S(0)) to projection node', function () {
            let ast = parseTreeVistor.visit(Evaluator.concreteSyntaxTree('P^2_1(1,S(0))'));
            expect(ast).to.be.a('RecursionASTNode');
            expect(ast.func).to.be.a('ProjectionASTNode');
            expect(ast.func.arity).to.eql(2);
            expect(ast.args.length).to.equal(2);
            expect(ast.args[0]).to.be.a('ConstASTNode');
            expect(ast.args[0].number).to.equal(1);
            expect(ast.args[1]).to.be.a('RecursionASTNode');
            expect(ast.args[1].func).to.be.a('SuccessorASTNode');
            expect(ast.args[1].args.length).to.equal(1);
            expect(ast.args[1].args[0]).to.be.a('ConstASTNode');
            expect(ast.args[1].args[0].number).to.equal(0);
        });

        it('should convert S.(S)', function () {
            let ast = parseTreeVistor.visit(Evaluator.concreteSyntaxTree('S.(S)'));
            expect(ast).to.be.a('CompositionASTNode');
            expect(ast.func).to.be.a('SuccessorASTNode');
            expect(ast.args.length).to.equal(1);
            expect(ast.args[0]).to.be.a('SuccessorASTNode');
        });

        it('should convert P^1_0:S.(P^3_2) to recursion node', function () {
            let ast = parseTreeVistor.visit(Evaluator.concreteSyntaxTree('P^1_0:S.(P^3_1)'));
            // expect(ast).to.be.a('RecursionASTNode');
            // expect(ast.base).to.be.a('ProjectionASTNode');
            // expect(ast.recursion).to.be.a('CompositionASTNode');
        });

    });
});

