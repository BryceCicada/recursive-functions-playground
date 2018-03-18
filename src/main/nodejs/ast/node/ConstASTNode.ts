import {ASTNode} from "./ASTNode";
import {ASTNodeVisitor} from "../visit/ASTNodeVisitor";
import {constType, Type} from "../../type/Type";

class ConstASTNode extends ASTNode {

    constructor(public readonly number: number) {
        super();
    }

    accept<T>(visitor: ASTNodeVisitor<T>): T {
        return visitor.visitConst(this);
    }

    toString(): string {
        return `${this.number}`;
    }

    static from(number: number) {
        let r = new ConstASTNode(number);
        r.type = constType;
        return r;
    }
}

export {ConstASTNode};
