let antlr4 = require('antlr4');
let RecFunLexer = require('../../../target/src/main/antlr/RecFunLexer');
let RecFunParser = require('../../../target/src/main/antlr/RecFunParser');
let ParseTreeVisitor = require('./parse/ParseTreeVisitor');

class Evaluator {
    static concreteSyntaxTree(input) {
        let chars = new antlr4.InputStream(input);
        let lexer = new RecFunLexer.RecFunLexer(chars);
        let tokens = new antlr4.CommonTokenStream(lexer);
        let parser = new RecFunParser.RecFunParser(tokens);
        parser.buildParseTrees = true;
        return parser.parse();
    }

    static abstractSyntaxTree(concreteSyntaxTree) {
        let astVisitor = new ParseTreeVisitor();
        return astVisitor.visit(concreteSyntaxTree);
    }
}

module.exports = Evaluator;