let chai = require('chai');
let expect = chai.expect;

let {ASTNodeVisitorContext, InvalidContextError} = require('../../../../main/nodejs/ast/visit/ASTNodeVisitorContext');
let {VariableASTNode} = require('../../../../main/nodejs/ast/node/VariableASTNode');
let {ConstASTNode} = require('../../../../main/nodejs/ast/node/ConstASTNode');
let {ProjectionASTNode} = require('../../../../main/nodejs/ast/node/ProjectionASTNode');
let {SuccessorASTNode} = require('../../../../main/nodejs/ast/node/SuccessorASTNode');
let {ApplicationASTNode} = require('../../../../main/nodejs/ast/node/ApplicationASTNode');
let {CompositionASTNode} = require('../../../../main/nodejs/ast/node/CompositionASTNode');

describe('ASTNodeVisitorContext', function () {
    it('should be defined', function () {
        new ASTNodeVisitorContext();
    });

    describe('get()', function () {
        let context = new ASTNodeVisitorContext();

        it('returns null for variable for new context', function() {
            let a = new VariableASTNode('a');
            expect(context.get(a)).to.eql(null);
        });

        it('returns a previously set variable', function() {
            let a = new VariableASTNode('a');
            context.set(a, 'foo');
            expect(context.get(a)).to.eql('foo');
        });

        it('returns a previously set variable from many', function() {
            let a = new VariableASTNode('a');
            let b = new VariableASTNode('b');
            context.set(a, 'foo');
            context.set(b, 'bar');
            expect(context.get(a)).to.eql('foo');
        });
    });

    describe('push()', function () {
        let context = new ASTNodeVisitorContext();

        it('get on inner context returns values from outer context', function() {
            let a = new VariableASTNode('a');
            context.set(a, 'foo');
            let inner = context.push();
            expect(inner.get(a)).to.eql('foo');
        });

    });

    describe('pop()', function () {
        let context = new ASTNodeVisitorContext();

        it('pop of root context throws InvalidContextError', function() {
            expect(() => context.pop()).to.throw(InvalidContextError);
        });


        it('get of variable in inner context after pop returns null', function() {
            let a = new VariableASTNode('a');
            let inner = context.push();
            inner.set(a, 'foo');
            let outer = inner.pop();
            expect(outer.get(a)).to.eql(null);
        });

    });
});

