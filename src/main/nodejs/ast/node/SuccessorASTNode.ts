import {ASTNode} from "./ASTNode";
import {ASTNodeVisitor} from "../visit/ASTNodeVisitor";
import {constType, functionType, Type} from "../../type/Type";

class SuccessorASTNode extends ASTNode {

    accept<T>(visitor: ASTNodeVisitor<T>): T {
        return visitor.visitSuccessor(this);
    }

    toString(): string {
        return 'S';
    }

}

export {SuccessorASTNode};
