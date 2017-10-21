class ASTNode {
    constructor() {
    }

    accept(visitor) {
        throw Error("Not implemented");
    }

}

module.exports = ASTNode;