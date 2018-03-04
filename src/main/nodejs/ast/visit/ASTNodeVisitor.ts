import {ASTNode} from "../node/ASTNode";
import {ConstASTNode} from "../node/ConstASTNode";
import {ApplicationASTNode} from "../node/ApplicationASTNode";
import {CompositionASTNode} from "../node/CompositionASTNode";
import {SuccessorASTNode} from "../node/SuccessorASTNode";
import {ProjectionASTNode} from "../node/ProjectionASTNode";
import {RecursionASTNode} from "../node/RecursionASTNode";

interface IASTNodeVisitor<T> {
    visit(node: ASTNode): T
    visitConst(node: ConstASTNode): T
    visitApplication(node: ApplicationASTNode): T
    visitComposition(node: CompositionASTNode): T
    visitSuccessor(node: SuccessorASTNode): T
    visitProjection(node: ProjectionASTNode): T
    visitRecursion(node: RecursionASTNode): T
}

abstract class ASTNodeVisitor<T> implements IASTNodeVisitor<T> {
    public visit(node: ASTNode): T {
        return node.accept(this);
    }

    public visitProjection(node: ProjectionASTNode): T {
        throw new Error("Method not implemented.");
    }

    public visitSuccessor(node: SuccessorASTNode): T {
        throw new Error("Method not implemented.");
    }

    public visitComposition(node: CompositionASTNode): T {
        throw new Error("Method not implemented.");
    }

    public visitApplication(node: ApplicationASTNode): T {
        throw new Error("Method not implemented.");
    }

    public visitConst(node: ConstASTNode): T {
        throw new Error("Method not implemented.");
    }

    visitRecursion(node: RecursionASTNode): T {
        throw new Error("Method not implemented.");
    }
}

export {ASTNodeVisitor};