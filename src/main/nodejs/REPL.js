let readline = require('readline');

let {TypingASTNodeVisitor} = require('./ast/visit/TypingASTNodeVisitor');
let {EvaluatorASTNodeVisitor} = require('./ast/visit/EvaluatorASTNodeVisitor');
let Evaluator = require('./Evaluator');

class REPL {
    constructor(inputStream, outputStream) {
        this.rl = readline.createInterface({
            input: inputStream,
            output: outputStream,
            prompt: "> "
        });

        let sc = new TypingASTNodeVisitor();
        let e = new EvaluatorASTNodeVisitor();

        this.rl.on('line', input => {
            if (input) {
                let cst = Evaluator.concreteSyntaxTree(input);
                let ast = Evaluator.abstractSyntaxTree(cst);
                let errs = sc.visit(ast);
                outputStream.cork();
                if (errs.length > 0) {
                    errs.forEach(err => outputStream.write(err.message));
                } else {
                    let evaluation = e.visit(ast);
                    outputStream.write(`${evaluation.toString()}: ${evaluation.type.toString()}`);
                    outputStream.write(`\n`);
                }
                process.nextTick(() => outputStream.uncork());
            }
            this.rl.prompt(true);
        });
    }

    start() {
        this.rl.prompt();
    }
}

module.exports = REPL;