import {ASTNode} from "./ASTNode";
import {ASTNodeVisitor} from "../visit/ASTNodeVisitor";
import {Type} from "../../type/Type";

class RecursionASTNode implements ASTNode {
    type: Type;

    constructor(public readonly base: ASTNode, public readonly recursion: ASTNode) {
        this.type = base.type;
    }

    accept<T>(visitor: ASTNodeVisitor<T>): T {
        return visitor.visitRecursion(this);
    }
}

export {RecursionASTNode};
