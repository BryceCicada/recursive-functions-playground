import {ASTNode} from "./ASTNode";
import {ASTNodeVisitor} from "../visit/ASTNodeVisitor";
import {constType, functionType, StaticTypeError, Type, Unifier} from "../../type/Type";

class RecursionASTNode implements ASTNode {
    private _type: Type | undefined;

    constructor(public readonly base: ASTNode, public readonly recursion: ASTNode) {
    }

    accept<T>(visitor: ASTNodeVisitor<T>): T {
        return visitor.visitRecursion(this);
    }

    get type(): Type {
        let baseTypes = [...this.base.type.types()];
        let recursionTypes = [...this.recursion.type.types()];

        let unifier = Unifier.from(baseTypes, recursionTypes.slice(2));
        if (!unifier) {
            throw new StaticTypeError(`Invalid recursion. No valid unifier.`);
        }

        return functionType(constType, unifier.applyTo(this.base.type));
    }
}

export {RecursionASTNode};
