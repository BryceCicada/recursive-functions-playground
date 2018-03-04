import {ASTNodeVisitor} from "../visit/ASTNodeVisitor";
import {Type} from "../../type/Type";

interface ASTNode {
    type: Type
    accept<T>(visitor: ASTNodeVisitor<T>): T;
}

export {ASTNode};