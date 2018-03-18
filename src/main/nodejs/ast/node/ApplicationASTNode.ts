import {ASTNode} from "./ASTNode";
import {ASTNodeVisitor} from "../visit/ASTNodeVisitor";
import {StaticTypeError, Type} from "../../type/Type";
import {MissingTypeError, TypeAlreadySetError} from "../visit/TypingASTNodeVisitor";

class ApplicationASTNode extends ASTNode {

    constructor(public readonly func: ASTNode, public readonly args: ASTNode[]) {
        super();
    }

    accept<T>(visitor: ASTNodeVisitor<T>): T {
        return visitor.visitApplication(this);
    }

    toString(): string {
        return `${this.func.toString()}(${this.args.map(a => a.toString()).join(',')})`;
    }

}

export {ApplicationASTNode};