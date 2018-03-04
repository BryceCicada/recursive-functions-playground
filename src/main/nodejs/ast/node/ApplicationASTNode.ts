import {ASTNode} from "./ASTNode";
import {ASTNodeVisitor} from "../visit/ASTNodeVisitor";
import {StaticTypeError, Type} from "../../type/Type";

class ApplicationASTNode implements ASTNode {
    private _type: Type | undefined;

    constructor(public readonly func: ASTNode, public readonly args: ASTNode[]) {
    }

    accept<T>(visitor: ASTNodeVisitor<T>): T {
        return visitor.visitApplication(this);
    }

    get type(): Type {
        if (!this._type) {
            let appliedType: Type | null = this.func.type;
            for (let i = 0; i < this.args.length; i++) {
                appliedType = appliedType.applyTo(this.args[i].type);
                if (!appliedType) {
                    throw new StaticTypeError(`Cannot apply ${this.func.type.toString()} to ${this.args[i].type.toString()} at index ${i}.`);
                }
            }
            this._type = appliedType;
        }
        return this._type;
    }
}

export {ApplicationASTNode};