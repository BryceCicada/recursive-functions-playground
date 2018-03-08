import {ASTNodeVisitor} from "./ASTNodeVisitor";
import {CompositionASTNode} from "../node/CompositionASTNode";
import {ConstASTNode} from "../node/ConstASTNode";
import {ApplicationASTNode} from "../node/ApplicationASTNode";
import {ASTNode} from "../node/ASTNode";
import {SuccessorASTNode} from "../node/SuccessorASTNode";
import {ProjectionASTNode} from "../node/ProjectionASTNode";
import {RecursionASTNode} from "../node/RecursionASTNode";

class PrintASTNodeVisitor extends ASTNodeVisitor<string> {
    public visitApplication(node: ApplicationASTNode): string {
        return `${this.visit(node.func)}(${node.args.map(a => this.visit(a)).join(',')})`;
    }

    public visitComposition(node: CompositionASTNode): string {
        return `${this.visit(node.func)}.(${node.args.map(a => this.visit(a)).join(',')})`;
    }

    public visitSuccessor(node: SuccessorASTNode): string {
        return 'S';
    }

    public visitConst(node: ConstASTNode): string {
        return `${node.number}`;
    }

    public visitProjection(node: ProjectionASTNode): string {
        return `P^${node.arity}_${node.index}`;
    }

    public visitRecursion(node: RecursionASTNode): string {
        return `(${this.visit(node.base)}:${this.visit(node.recursion)})`;
    }

    private makeString(expr: string, type: string): string {
        return `${expr}: ${type}`;
    }
}

export {PrintASTNodeVisitor}