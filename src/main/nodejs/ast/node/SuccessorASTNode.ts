import {ASTNode} from "./ASTNode";
import {ASTNodeVisitor} from "../visit/ASTNodeVisitor";
import {constType, functionType, Type} from "../../type/Type";

class SuccessorASTNode implements ASTNode {
    type: Type = functionType(constType, constType);

    accept<T>(visitor: ASTNodeVisitor<T>): T {
        return visitor.visitSuccessor(this);
    }
}

export {SuccessorASTNode};
