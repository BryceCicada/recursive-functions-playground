import {ASTNode} from "./ASTNode";
import {ASTNodeVisitor} from "../visit/ASTNodeVisitor";
import {constType, Type} from "../../type/Type";

class ConstASTNode implements ASTNode {
    type: Type = constType;
    constructor(public readonly number: number) {
    }

    accept<T>(visitor: ASTNodeVisitor<T>): T {
        return visitor.visitConst(this);
    }
}

export {ConstASTNode};
