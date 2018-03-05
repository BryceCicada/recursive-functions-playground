let readline = require('readline');

let {TypeCheckASTNodeVisitor} = require('./ast/visit/TypeCheckASTNodeVisitor');
let {EvaluatorASTNodeVisitor} = require('./ast/visit/EvaluatorASTNodeVisitor');
let {PrintASTNodeVisitor} = require('./ast/visit/PrintASTNodeVisitor');
let Evaluator = require('./Evaluator');

class REPL {
    constructor(inputStream, outputStream) {
        this.rl = readline.createInterface({
            input: inputStream,
            output: outputStream,
            prompt: "> "
        });

        let sc = new TypeCheckASTNodeVisitor();
        let e = new EvaluatorASTNodeVisitor();
        let p = new PrintASTNodeVisitor();

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
                    outputStream.write(`${p.visit(evaluation)}: ${evaluation.type.toString()}`);
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