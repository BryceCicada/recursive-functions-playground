let {TypingASTNodeVisitor} = require('./ast/visit/TypingASTNodeVisitor');
let {EvaluatorASTNodeVisitor} = require('./ast/visit/EvaluatorASTNodeVisitor');
let Evaluator = require('./Evaluator');
const repl = require('repl');

class REPL {

    eval (cmd, context, filename, callback) {
        let typeChecker = new TypingASTNodeVisitor();
        let evaluator = new EvaluatorASTNodeVisitor();
        let cst = Evaluator.concreteSyntaxTree(cmd);
        let ast = Evaluator.abstractSyntaxTree(cst);
        typeChecker.visit(ast);
        let evaluation = evaluator.visit(ast);
        callback(null, `${evaluation.toString()}: ${evaluation.type.toString()}`);
    }

    start() {
        repl.start({ prompt: '> ', eval: this.eval });
    }
}

module.exports = REPL;