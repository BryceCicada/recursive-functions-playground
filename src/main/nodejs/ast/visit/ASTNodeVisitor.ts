import {ASTNode} from "../node/ASTNode";
import {ConstASTNode} from "../node/ConstASTNode";
import {ApplicationASTNode} from "../node/ApplicationASTNode";
import {CompositionASTNode} from "../node/CompositionASTNode";
import {SuccessorASTNode} from "../node/SuccessorASTNode";
import {ProjectionASTNode} from "../node/ProjectionASTNode";
import {RecursionASTNode} from "../node/RecursionASTNode";
import {BlockASTNode} from "../node/BlockASTNode";
import {AssignmentASTNode} from "../node/AssignmentASTNode";
import {VariableASTNode} from "../node/VariableASTNode";
import {ASTNodeVisitorContext} from "./ASTNodeVisitorContext";
import {StaticTypeError, Type} from "../../type/Type";

interface IASTNodeVisitor<T> {
    visit(node: ASTNode): T
    visitConst(node: ConstASTNode): T
    visitApplication(node: ApplicationASTNode): T
    visitComposition(node: CompositionASTNode): T
    visitSuccessor(node: SuccessorASTNode): T
    visitProjection(node: ProjectionASTNode): T
    visitRecursion(node: RecursionASTNode): T
    visitBlock(node: BlockASTNode): T
    visitAssignment(node: AssignmentASTNode): T
    visitVariable(node: VariableASTNode): T
}

abstract class ASTNodeVisitor<T> implements IASTNodeVisitor<T> {

    protected context = new ASTNodeVisitorContext<T>();

    public visit(node: ASTNode): T {
        return node.accept(this);
    }

    public visitProjection(node: ProjectionASTNode): T {
        throw new Error("visitProjection: Method not implemented.");
    }

    public visitSuccessor(node: SuccessorASTNode): T {
        throw new Error("visitSuccessor: Method not implemented.");
    }

    public visitComposition(node: CompositionASTNode): T {
        throw new Error("visitComposition: Method not implemented.");
    }

    public visitApplication(node: ApplicationASTNode): T {
        throw new Error("visitApplication: Method not implemented.");
    }

    public visitConst(node: ConstASTNode): T {
        throw new Error("visitConst: Method not implemented.");
    }

    public visitRecursion(node: RecursionASTNode): T {
        throw new Error("visitRecursion: Method not implemented.");
    }

    public visitAssignment(node: AssignmentASTNode): T {
        let func = this.visit(node.func);
        this.context.set(node.variable, func);
        return func;
    }

    public visitBlock(node: BlockASTNode): T {
        this.context = this.context.push();
        for (let assignment of node.assignments) {
            // Populate the context
            this.visit(assignment);
        }
        let r = this.visit(node.func);
        this.context = this.context.pop();
        return r;
    }

    public visitVariable(node: VariableASTNode): T {
        let func = this.context.get(node);
        if (!func) {
            throw new StaticTypeError(`No such variable ${node.name}`);
        }
        return func;
    }

}

export {ASTNodeVisitor};