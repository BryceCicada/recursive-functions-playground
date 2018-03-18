import {ASTNode} from "./ASTNode";
import {ASTNodeVisitor} from "../visit/ASTNodeVisitor";
import {constType, functionType, StaticTypeError, Type, Unifier} from "../../type/Type";

class RecursionASTNode extends ASTNode {
    constructor(public readonly base: ASTNode, public readonly recursion: ASTNode) {
        super();
    }

    accept<T>(visitor: ASTNodeVisitor<T>): T {
        return visitor.visitRecursion(this);
    }

    toString(): string {
        return `(${this.base.toString()}:${this.recursion.toString()})`;
    }
}

export {RecursionASTNode};
