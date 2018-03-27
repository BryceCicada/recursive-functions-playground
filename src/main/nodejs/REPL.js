let {TypingASTNodeVisitor} = require('./ast/visit/TypingASTNodeVisitor');
let {EvaluatorASTNodeVisitor} = require('./ast/visit/EvaluatorASTNodeVisitor');
let Evaluator = require('./Evaluator');
let Token = require('antlr4').Token;
let repl = require('repl');
let StaticTypeError = require('./type/Type').StaticTypeError;
let EvaluationError = require('./ast/visit/EvaluatorASTNodeVisitor')

class REPL {

    eval(cmd, context, filename, callback) {
        if (!cmd.trim()) {
            return callback(new repl.Recoverable());
        }
        let typeChecker = new TypingASTNodeVisitor();
        let evaluator = new EvaluatorASTNodeVisitor();
        let errors = [];
        let keepGoing = false;
        let cst = Evaluator.concreteSyntaxTree(cmd, {
            syntaxError: function (recognizer, offendingSymbol, line, column, msg, e) {
                if (offendingSymbol.type === Token.EOF) {
                    keepGoing = true;
                } else {
                    errors.push(msg);
                }
            },
            reportAttemptingFullContext: () => {},
            reportAmbiguity: () => {}

        });
        if (keepGoing) {
            callback(new repl.Recoverable());
        } else {
            if (!errors.length) {
                let ast = Evaluator.abstractSyntaxTree(cst);
                try {
                    typeChecker.visit(ast);
                    let evaluation = evaluator.visit(ast);
                    callback(null, `${evaluation.toString()}: ${evaluation.type.toString()}`);
                } catch (e) {
                    if (e instanceof StaticTypeError) {
                        callback(e.message, null)
                    } else {
                        throw e;
                    }
                }
            } else {
                callback(errors.join('\n'), null);
            }
        }
    }

    start() {
        repl.start({prompt: '> ', eval: this.eval, writer: x => x});
    }
}

module.exports = REPL;