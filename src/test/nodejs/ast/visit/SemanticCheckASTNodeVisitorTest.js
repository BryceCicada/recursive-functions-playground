let chai = require('chai');
let expect = chai.expect;

let SemanticCheckASTNodeVisitor = require('../../../../main/nodejs/ast/visit/SemanticCheckASTNodeVisitor');
let ConstASTNode = require('../../../../main/nodejs/ast/node/ConstASTNode');
let ProjectionASTNode = require('../../../../main/nodejs/ast/node/ProjectionASTNode');
let SuccessorASTNode = require('../../../../main/nodejs/ast/node/SuccessorASTNode');
let CompositionASTNode = require('../../../../main/nodejs/ast/node/CompositionASTNode');
let ApplicationASTNode = require('../../../../main/nodejs/ast/node/ApplicationASTNode');

describe('SemanticCheckASTNodeVisitor', function () {
    it('should be defined', function () {
        new SemanticCheckASTNodeVisitor();
    });

    describe('visit()', function () {
        let visitor = new SemanticCheckASTNodeVisitor();

        describe('CompositionASTNode', function () {
            it('should return empty errors on S.(S)', function () {
                let node = new CompositionASTNode(new SuccessorASTNode(), [new SuccessorASTNode()]);
                expect(visitor.visit(node)).to.be.empty;
            });

            it('should return error on S.(S,S)', function () {
                let node = new CompositionASTNode(new SuccessorASTNode(), [new SuccessorASTNode(), new SuccessorASTNode()]);
                expect(visitor.visit(node)).to.not.be.empty;
            });

            it('should return error on P^2_0.(P^1_0,P^2_0)', function () {
                let node = new CompositionASTNode(new ProjectionASTNode(2,0), [new ProjectionASTNode(1,0), new ProjectionASTNode(2,0)]);
                expect(visitor.visit(node)).to.not.be.empty;
            });

        });

        describe('ApplicationASTNode', function () {
            it('should return empty errors on S(0)', function () {
                let node = new ApplicationASTNode(new SuccessorASTNode(), [new ConstASTNode(0)]);
                expect(visitor.visit(node)).to.be.empty;
            });

            it('should return error on S(0,1)', function () {
                let node = new ApplicationASTNode(new SuccessorASTNode(), [new ConstASTNode(0), new ConstASTNode(0)]);
                expect(visitor.visit(node)).to.not.be.empty;
            });

        });

        describe('ConstASTNode', function () {
            it('should return empty errors', function () {
                let node = new ConstASTNode(0);
                expect(visitor.visit(node)).to.be.empty;
            });

        });

        describe('ProjectionASTNode', function () {
            it('should return empty errors on P^3_1', function () {
                let node = new ProjectionASTNode(3, 1);
                expect(visitor.visit(node)).to.be.empty;
            });

            it('should return error on P^1_3', function () {
                let node = new ProjectionASTNode(1, 3);
                expect(visitor.visit(node)).to.not.be.empty;
            });
        });

        describe('SuccessorASTNode', function () {
            it('should return empty errors', function () {
                let node = new SuccessorASTNode();
                expect(visitor.visit(node)).to.be.empty;
            });

        });

    });
});

