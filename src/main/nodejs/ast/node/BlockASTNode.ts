import {ASTNode} from "./ASTNode";
import {ASTNodeVisitor} from "../visit/ASTNodeVisitor";
import {constType, Type} from "../../type/Type";
import {AssignmentASTNode} from "./AssignmentASTNode";

class BlockASTNode extends ASTNode {

    constructor(public readonly func: ASTNode, public readonly assignments: AssignmentASTNode[]) {
        super();
    }

    accept<T>(visitor: ASTNodeVisitor<T>): T {
        return visitor.visitBlock(this);
    }

    toString(): string {
        return `let ${this.assignments.map(a => a.toString()).join(',')} in ${this.func}`;
    }
}

export {BlockASTNode};
