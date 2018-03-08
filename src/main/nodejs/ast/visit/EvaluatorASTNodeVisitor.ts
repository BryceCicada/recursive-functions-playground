import {ASTNodeVisitor} from "./ASTNodeVisitor";
import {ASTNode} from "../node/ASTNode";
import {ConstASTNode} from "../node/ConstASTNode";
import {ApplicationASTNode} from "../node/ApplicationASTNode";
import {CompositionASTNode} from "../node/CompositionASTNode";
import {SuccessorASTNode} from "../node/SuccessorASTNode";
import {ProjectionASTNode} from "../node/ProjectionASTNode";
import {RecursionASTNode} from "../node/RecursionASTNode";


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
                throw new EvaluationError("Missing arguments for successor");
            }
        } else {
            return node;
        }
    }

    public visitProjection(node: ProjectionASTNode): ASTNode {
        if (this.apply) {
            let args = this.stack.pop();
            if (args) {
                return args[node.index];
            } else {
                throw new EvaluationError("Missing arguments for projection");
            } 
                
        } else {
            return node;
        }
    }

    public visitRecursion(node: RecursionASTNode): ASTNode {
        if (this.apply) {
            let args = this.stack.pop();
            if (args) {
                let recursionCounter = (<ConstASTNode>args[0]).number;
                if (recursionCounter === 0) {
                    this.stack.push(args.slice(1));
                    return this.visit(node.base);
                } else {
                    let recursionArgs : ASTNode[] = [];
                    let reducedCounterNode = new ConstASTNode(recursionCounter-1);
                    recursionArgs.push(reducedCounterNode);
                    recursionArgs.push(...args.slice(1));
                    this.stack.push(recursionArgs);
                    let recursionResult = this.visit(node);

                    let resultArgs : ASTNode[] = [];
                    resultArgs.push(reducedCounterNode);
                    resultArgs.push(recursionResult);
                    resultArgs.push(...args.slice(1));
                    this.stack.push(resultArgs);
                    return this.visit(node.recursion);
                }
            } else {
                throw new EvaluationError("Missing arguments for recursion");
            }

        } else {
            return node;
        }
    }

}

export {EvaluatorASTNodeVisitor};