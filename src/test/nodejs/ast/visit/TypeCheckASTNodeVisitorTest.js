let chai = require('chai');
let expect = chai.expect;

let {TypeCheckASTNodeVisitor} = require('../../../../main/nodejs/ast/visit/TypeCheckASTNodeVisitor');
let {ConstASTNode} = require('../../../../main/nodejs/ast/node/ConstASTNode');
let {ProjectionASTNode} = require('../../../../main/nodejs/ast/node/ProjectionASTNode');
let {SuccessorASTNode} = require('../../../../main/nodejs/ast/node/SuccessorASTNode');
let {CompositionASTNode} = require('../../../../main/nodejs/ast/node/CompositionASTNode');
let {ApplicationASTNode} = require('../../../../main/nodejs/ast/node/ApplicationASTNode');

describe('TypeCheckASTNodeVisitor', function () {
    it('should be defined', function () {
        new TypeCheckASTNodeVisitor();
    });

    describe('visit()', function () {
        let visitor = new TypeCheckASTNodeVisitor();

        describe('CompositionASTNode', function () {
            it('should return empty errors on S.(S)', function () {
                let node = new CompositionASTNode(new SuccessorASTNode(), [new SuccessorASTNode()]);
                expect(visitor.visit(node)).to.be.empty;
            });

            it('should return error on S.(P^2_0,S)', function () {
                let node = new CompositionASTNode(new SuccessorASTNode(), [new ProjectionASTNode(2,0), new SuccessorASTNode()]);
                expect(visitor.visit(node)).to.not.be.empty;
            });

            it('should return error on S.(S,S)', function () {
                let node = new CompositionASTNode(new SuccessorASTNode(), [new SuccessorASTNode(), new SuccessorASTNode()]);
                expect(visitor.visit(node)).to.not.be.empty;
            });

            it('should return error on P^2_0.(P^1_0,P^2_0)', function () {
                let node = new CompositionASTNode(new ProjectionASTNode(2,0), [new ProjectionASTNode(1,0), new ProjectionASTNode(2,0)]);
                expect(visitor.visit(node)).to.not.be.empty;
            });

            it('should return empty errors on P^2_0.(S,S)', function () {
                let node = new CompositionASTNode(new ProjectionASTNode(2,0), [new SuccessorASTNode(), new SuccessorASTNode()]);
                expect(visitor.visit(node)).to.be.empty;
            });

            it('should return empty errors on P^2_0.(P^3_1,P^3_2)', function () {
                let node = new CompositionASTNode(new ProjectionASTNode(2,0), [new ProjectionASTNode(3,1), new ProjectionASTNode(3,2)]);
                expect(visitor.visit(node)).to.be.empty;
            });

            it('should return empty errors on S.(P^2_0.(P^3_1,P^3_2))', function () {
                let node = new CompositionASTNode(
                    new SuccessorASTNode(), [
                        new CompositionASTNode(
                            new ProjectionASTNode(2,0), [
                                new ProjectionASTNode(3,1),
                                new ProjectionASTNode(3,2)
                            ]
                        )
                    ]
                );
                expect(visitor.visit(node)).to.be.empty;
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

