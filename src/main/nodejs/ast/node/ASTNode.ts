import {ASTNodeVisitor} from "../visit/ASTNodeVisitor";
import {Type} from "../../type/Type";
import {MissingTypeError, TypeAlreadySetError} from "../visit/TypingASTNodeVisitor";

abstract class ASTNode {
    protected _type: Type | undefined;
    abstract accept<T>(visitor: ASTNodeVisitor<T>): T;
    abstract toString(): string;

    get type(): Type {
        if (!this._type) {
            throw new MissingTypeError(this);
        }
        return this._type;
    }

    set type(type: Type) {
        if (this._type) {
            throw new TypeAlreadySetError(this);
        }
        this._type = type;
    }

}

export {ASTNode};