import {ASTNodeVisitor} from "./ASTNodeVisitor";
import {ConstASTNode} from "../node/ConstASTNode";
import {SuccessorASTNode} from "../node/SuccessorASTNode";
import {ApplicationASTNode} from "../node/ApplicationASTNode";
import {ProjectionASTNode} from "../node/ProjectionASTNode";
import {CompositionASTNode} from "../node/CompositionASTNode";
import {StaticTypeError} from "../../type/Type";
import {RecursionASTNode} from "../node/RecursionASTNode";

class TypeCheckFailure {
    constructor(public readonly message: string) {
    }
}

class TypeCheckASTNodeVisitor extends ASTNodeVisitor<TypeCheckFailure[]> {
    public visitConst(node: ConstASTNode): TypeCheckFailure[] {
        return [];
    }

    visitSuccessor(node: SuccessorASTNode): TypeCheckFailure[] {
        return [];
    }

    visitApplication(node: ApplicationASTNode): TypeCheckFailure[] {
        let nodeErrs: TypeCheckFailure[] = [];
        let funcErr = this.visit(node.func);
        let argErrs = node.args.map(arg => this.visit(arg));
        nodeErrs.concat(funcErr, ...argErrs);
        try {
            node.type;
        } catch (e) {
            if (e instanceof StaticTypeError) {
                nodeErrs.push(new TypeCheckFailure(e.message))
            } else {
                throw e;
            }
        }
        return nodeErrs;
    }

    visitProjection(node: ProjectionASTNode): TypeCheckFailure[] {
        let nodeErrs: TypeCheckFailure[] = [];
        try {
            node.type;
        } catch (e) {
            if (e instanceof StaticTypeError) {
                nodeErrs.push(new TypeCheckFailure(e.message))
            } else {
                throw e;
            }
        }
        return nodeErrs;
    }

    visitComposition(node: CompositionASTNode): TypeCheckFailure[] {
        let nodeErrs: TypeCheckFailure[] = [];
        let funcErr = this.visit(node.func);
        let argErrs = node.args.map(arg => this.visit(arg));
        nodeErrs.concat(funcErr, ...argErrs);
        try {
            node.type;
        } catch (e) {
            if (e instanceof StaticTypeError) {
                nodeErrs.push(new TypeCheckFailure(e.message))
            } else {
                throw e;
            }
        }
        return nodeErrs;
    }

    visitRecursion(node: RecursionASTNode): TypeCheckFailure[] {
        let nodeErrs: TypeCheckFailure[] = [];
        let baseErrs = this.visit(node.base);
        let recursionErrs = this.visit(node.recursion);
        nodeErrs.concat(baseErrs, recursionErrs);
        try {
            node.type;
        } catch (e) {
            if (e instanceof StaticTypeError) {
                nodeErrs.push(new TypeCheckFailure(e.message))
            } else {
                throw e;
            }
        }
        return nodeErrs;
    }

}

export {TypeCheckASTNodeVisitor, TypeCheckFailure};