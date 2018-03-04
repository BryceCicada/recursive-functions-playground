import {ASTNodeVisitor} from "./ASTNodeVisitor";
import {ASTNode} from "../node/ASTNode";
import {ConstASTNode} from "../node/ConstASTNode";
import {ApplicationASTNode} from "../node/ApplicationASTNode";
import {CompositionASTNode} from "../node/CompositionASTNode";
import {SuccessorASTNode} from "../node/SuccessorASTNode";
import {ProjectionASTNode} from "../node/ProjectionASTNode";


/**
 * Represents an error during evaluation of a parse tree as a
 * result of incorrect language implementation.
 */
class EvaluationError extends Error {
}

class EvaluatorASTNodeVisitor extends ASTNodeVisitor<ASTNode> {
    private stack: ASTNode[][] = [];
    private apply: boolean = false;
    private compose: boolean = false;

    public visitConst(node: ConstASTNode): ASTNode {
        return node;
    }

    public visitApplication(node: ApplicationASTNode): ASTNode {
        this.stack.push(node.args.map(a => this.visit(a)));
        this.apply = true;
        let r = this.visit(node.func);
        this.apply = false;
        return r;
    }

    public visitComposition(node: CompositionASTNode): ASTNode {
        if (this.apply) {
            let args = this.stack.pop();
            if (args) {
                let definedArgs = args;
                this.stack.push(node.args.map(nodeArg => {
                    this.stack.push(definedArgs);
                    return this.visit(nodeArg);
                }));
            }
            return this.visit(node.func);
        } else {
            return node;
        }
    }

    public visitSuccessor(node: SuccessorASTNode): ASTNode {
        if (this.apply) {
            let args = this.stack.pop();
            if (args) {
                // It's OK to cast args[0] to ConstASTNode here because our
                // semantic checks are performed already by our language's type system.
                return new ConstASTNode((<ConstASTNode> args[0]).number + 1);
            } else {
                throw new EvaluationError("Missing arguments for sucessor");
            }
        } else {
            return node;
        }
    }

    public visitProjection(node: ProjectionASTNode): ASTNode {
        if (this.apply || this.compose) {
            let args = this.stack.pop();
            if (args) {
                return args[node.index];
            } else {
                throw new EvaluationError("Missing arguments for application or composition");
            } 
                
        } else {
            return node;
        }
    }

}

export {EvaluatorASTNodeVisitor};