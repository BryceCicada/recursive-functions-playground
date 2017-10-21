class ASTNodeVisitor {

    visit(node) {
        return node.accept(this);
    }

}

module.exports = ASTNodeVisitor;