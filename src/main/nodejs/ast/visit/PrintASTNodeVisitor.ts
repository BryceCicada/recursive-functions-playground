import {ASTNodeVisitor} from "./ASTNodeVisitor";
import {CompositionASTNode} from "../node/CompositionASTNode";
import {ConstASTNode} from "../node/ConstASTNode";
import {ApplicationASTNode} from "../node/ApplicationASTNode";
import {ASTNode} from "../node/ASTNode";
import {SuccessorASTNode} from "../node/SuccessorASTNode";
import {ProjectionASTNode} from "../node/ProjectionASTNode";

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

    private makeString(expr: string, type: string): string {
        return `${expr}: ${type}`;
    }
}

export {PrintASTNodeVisitor}