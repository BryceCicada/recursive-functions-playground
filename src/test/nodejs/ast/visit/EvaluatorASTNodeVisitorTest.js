let chai = require('chai');
let expect = chai.expect;

let {EvaluatorASTNodeVisitor} = require('../../../../main/nodejs/ast/visit/EvaluatorASTNodeVisitor');
let {ConstASTNode} = require('../../../../main/nodejs/ast/node/ConstASTNode');
let {ProjectionASTNode} = require('../../../../main/nodejs/ast/node/ProjectionASTNode');
let {SuccessorASTNode} = require('../../../../main/nodejs/ast/node/SuccessorASTNode');
let {ApplicationASTNode} = require('../../../../main/nodejs/ast/node/ApplicationASTNode');
let {CompositionASTNode} = require('../../../../main/nodejs/ast/node/CompositionASTNode');

describe('EvaluatorASTNodeVisitor', function () {
    it('should be defined', function () {
        new EvaluatorASTNodeVisitor();
    });

    describe('visit()', function () {
        let visitor = new EvaluatorASTNodeVisitor();

        describe('ConstASTNode', function () {

            it('should evaluate 0', function () {
                let evaluation = visitor.visit(new ConstASTNode(0));
                expect(evaluation).to.be.an.instanceof(ConstASTNode);
                expect(evaluation.number).to.equal(0);
            });

            it('should evaluate 1', function () {
                let evaluation = visitor.visit(new ConstASTNode(1));
                expect(evaluation).to.be.an.instanceof(ConstASTNode);
                expect(evaluation.number).to.equal(1);
            });
        });

        describe('ApplicationASTNode', function () {

            it('should evaluate S(0) to 1', function () {
                let evaluation = visitor.visit(new ApplicationASTNode(new SuccessorASTNode(), [new ConstASTNode(0)]));
                expect(evaluation).to.be.an.instanceof(ConstASTNode);
                expect(evaluation.number).to.equal(1);
            });

            it('should evaluate S.(S)(0) to 2', function () {
                let evaluation = visitor.visit(
                    new ApplicationASTNode(
                        new CompositionASTNode(
                            new SuccessorASTNode(), [new SuccessorASTNode()]
                        ),
                        [new ConstASTNode(0)])
                );
                expect(evaluation).to.be.an.instanceof(ConstASTNode);
                expect(evaluation.number).to.equal(2);
            });

            it('should evaluate P^1_0(0) to 0', function () {
                let evaluation = visitor.visit(new ApplicationASTNode(new ProjectionASTNode(1,0), [new ConstASTNode(0)]));
                expect(evaluation).to.be.an.instanceof(ConstASTNode);
                expect(evaluation.number).to.equal(0);
            });

            it('should evaluate P^2_1(0,1) to 1', function () {
                let evaluation = visitor.visit(new ApplicationASTNode(new ProjectionASTNode(2,1), [new ConstASTNode(0), new ConstASTNode(1)]));
                expect(evaluation).to.be.an.instanceof(ConstASTNode);
                expect(evaluation.number).to.equal(1);
            });
        });
    });
});

