import {ASTNode} from "./ASTNode";
import {ASTNodeVisitor} from "../visit/ASTNodeVisitor";
import {constType, Type} from "../../type/Type";

class VariableASTNode extends ASTNode {

    constructor(public readonly name: string) {
        super();
    }

    public accept<T>(visitor: ASTNodeVisitor<T>): T {
        return visitor.visitVariable(this);
    }

    toString(): string {
        return this.name;
    }

}

export {VariableASTNode};
