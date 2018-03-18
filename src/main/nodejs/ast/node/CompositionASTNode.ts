import {ASTNode} from "./ASTNode";
import {ASTNodeVisitor} from "../visit/ASTNodeVisitor";
import {StaticTypeError, Type, Unifier, from, isEqual} from "../../type/Type";

class CompositionASTNode extends ASTNode {

    constructor(public readonly func: ASTNode, public readonly args: ASTNode[]) {
        super();
    }

    accept<T>(visitor: ASTNodeVisitor<T>): T {
        return visitor.visitComposition(this);
    }

    toString(): string {
        return `${this.func.toString()}.(${this.args.map(a => a.toString()).join(',')})`;
    }

}

export {CompositionASTNode};
