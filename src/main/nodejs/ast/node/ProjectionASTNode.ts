import {ASTNode} from "./ASTNode";
import {ASTNodeVisitor} from "../visit/ASTNodeVisitor";
import {functionType, genericType, StaticTypeError, Type} from "../../type/Type";

class ProjectionASTNode implements ASTNode {
    private _type: Type | undefined;

    constructor(public readonly arity: number, public readonly index: number) {
    }

    accept<T>(visitor: ASTNodeVisitor<T>): T {
        return visitor.visitProjection(this);
    }

    get type(): Type {
        if (!this._type) {
            if (this.index >= this.arity) {
                throw new StaticTypeError("Projection index out of bounds");
            }
            let genericTypes = Array(this.arity).fill(0).map(() => genericType());
            genericTypes.push(genericTypes[this.index]);
            this._type = genericTypes.reverse().reduce((acc, x) => functionType(x, acc));
        }
        return this._type;
    }

}

export {ProjectionASTNode};
