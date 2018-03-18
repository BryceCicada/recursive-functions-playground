import {ASTNode} from "./ASTNode";
import {ASTNodeVisitor} from "../visit/ASTNodeVisitor";
import {constType, Type} from "../../type/Type";
import {VariableASTNode} from "./VariableASTNode";

class AssignmentASTNode extends ASTNode {
    constructor(public readonly variable: VariableASTNode, public readonly func: ASTNode) {
        super();
    }

    accept<T>(visitor: ASTNodeVisitor<T>): T {
        return visitor.visitAssignment(this);
    }

    toString(): string {
        return `${this.variable.toString()} = ${this.func.toString()}`;
    }
}

export {AssignmentASTNode};
