import {ASTNode} from "./ASTNode";
import {ASTNodeVisitor} from "../visit/ASTNodeVisitor";
import {functionType, genericType, StaticTypeError, Type} from "../../type/Type";

class ProjectionASTNode extends ASTNode {

    constructor(public readonly arity: number, public readonly index: number) {
        super();
    }

    accept<T>(visitor: ASTNodeVisitor<T>): T {
        return visitor.visitProjection(this);
    }

    toString(): string {
        return `P^${this.arity}_${this.index}`;
    }
}

export {ProjectionASTNode};
