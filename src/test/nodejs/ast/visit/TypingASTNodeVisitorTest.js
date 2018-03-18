let chai = require('chai');
let expect = chai.expect;

let {StaticTypeError} = require('../../../../main/nodejs/type/Type');
let {TypingASTNodeVisitor} = require('../../../../main/nodejs/ast/visit/TypingASTNodeVisitor');
let {ConstASTNode} = require('../../../../main/nodejs/ast/node/ConstASTNode');
let {ProjectionASTNode} = require('../../../../main/nodejs/ast/node/ProjectionASTNode');
let {SuccessorASTNode} = require('../../../../main/nodejs/ast/node/SuccessorASTNode');
let {CompositionASTNode} = require('../../../../main/nodejs/ast/node/CompositionASTNode');
let {ApplicationASTNode} = require('../../../../main/nodejs/ast/node/ApplicationASTNode');
let {RecursionASTNode} = require('../../../../main/nodejs/ast/node/RecursionASTNode');

describe('TypingASTNodeVisitor', function () {
    it('should be defined', function () {
        new TypingASTNodeVisitor();
    });

    describe('visit()', function () {
        let visitor = new TypingASTNodeVisitor();

        describe('CompositionASTNode', function () {
            it('should return (* -> *) errors on S.(S)', function () {
                let node = new CompositionASTNode(new SuccessorASTNode(), [new SuccessorASTNode()]);
                expect(visitor.visit(node).toString()).to.eql('(* -> *)');
            });

            it('should throw StaticTypeError on S.(P^2_0,S)', function () {
                let node = new CompositionASTNode(new SuccessorASTNode(), [new ProjectionASTNode(2,0), new SuccessorASTNode()]);
                expect(() => visitor.visit(node)).to.throw(StaticTypeError);
            });

            it('should throw StaticTypeError on S.(S,S)', function () {
                let node = new CompositionASTNode(new SuccessorASTNode(), [new SuccessorASTNode(), new SuccessorASTNode()]);
                expect(() => visitor.visit(node)).to.throw(StaticTypeError);
            });

            it('should throw StaticTypeError on P^2_0.(P^1_0,P^2_0)', function () {
                let node = new CompositionASTNode(new ProjectionASTNode(2,0), [new ProjectionASTNode(1,0), new ProjectionASTNode(2,0)]);
                expect(() => visitor.visit(node)).to.throw(StaticTypeError);
            });

            it('should return (* -> *) on P^2_0.(S,S)', function () {
                let node = new CompositionASTNode(new ProjectionASTNode(2,0), [new SuccessorASTNode(), new SuccessorASTNode()]);
                expect(visitor.visit(node).toString()).to.eql('(* -> *)');
            });

            it('should return (a -> (b -> (c -> b))) on P^2_0.(P^3_1,P^3_2)', function () {
                let node = new CompositionASTNode(
                    new ProjectionASTNode(2,0), [
                        new ProjectionASTNode(3,1),
                        new ProjectionASTNode(3,2)
                    ]
                );
                expect(visitor.visit(node).toString()).to.eql('(a -> (b -> (c -> b)))');
            });

            it('should return (a -> (* -> (b -> *))) on S.(P^2_0.(P^3_1,P^3_2))', function () {
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
                expect(visitor.visit(node).toString()).to.eql('(a -> (* -> (b -> *)))');
            });


        });

        describe('ApplicationASTNode', function () {
            it('should return * on S(0)', function () {
                let node = new ApplicationASTNode(new SuccessorASTNode(), [new ConstASTNode(0)]);
                expect(visitor.visit(node).toString()).to.eql('*');
            });

            it('should throw StaticTypeError on S(0,1)', function () {
                let node = new ApplicationASTNode(new SuccessorASTNode(), [new ConstASTNode(0), new ConstASTNode(0)]);
                expect(() => visitor.visit(node)).to.throw(StaticTypeError);
            });

        });

        describe('ConstASTNode', function () {
            it('should return * on 0', function () {
                let node = new ConstASTNode(0);
                expect(visitor.visit(node).toString()).to.eql('*');
            });

        });

        describe('ProjectionASTNode', function () {
            it('should return (a -> (b -> (c -> b))) on P^3_1', function () {
                let node = new ProjectionASTNode(3, 1);
                expect(visitor.visit(node).toString()).to.eql('(a -> (b -> (c -> b)))');
            });

            it('should throw StaticTypeError on P^1_3', function () {
                let node = new ProjectionASTNode(1, 3);
                expect(() => visitor.visit(node)).to.throw(StaticTypeError);
            });
        });

        describe('SuccessorASTNode', function () {
            it('should return (* -> *) on S', function () {
                let node = new SuccessorASTNode();
                expect(visitor.visit(node).toString()).to.eql('(* -> *)');
            });
        });

        describe('RecursionASTNode', function () {
            it('should return empty errors', function () {
                let node = new RecursionASTNode(
                    new ProjectionASTNode(1,0),
                    new ProjectionASTNode(3,2)
                );
                expect(visitor.visit(node).toString()).to.eql('(* -> (a -> a))');
            });

            it('should throw StaticTypeError on P^1_0:P^2_1', function () {
                let node = new RecursionASTNode(
                    new ProjectionASTNode(1,0),
                    new ProjectionASTNode(2,1)
                );
                expect(() => visitor.visit(node)).to.throw(StaticTypeError);
            });
        });
    });
});

