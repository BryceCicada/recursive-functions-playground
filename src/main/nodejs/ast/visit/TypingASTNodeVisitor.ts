import {ASTNodeVisitor} from "./ASTNodeVisitor";
import {ConstASTNode} from "../node/ConstASTNode";
import {SuccessorASTNode} from "../node/SuccessorASTNode";
import {ApplicationASTNode} from "../node/ApplicationASTNode";
import {ProjectionASTNode} from "../node/ProjectionASTNode";
import {CompositionASTNode} from "../node/CompositionASTNode";
import {constType, from, functionType, genericType, isEqual, StaticTypeError, Type, Unifier} from "../../type/Type";
import {RecursionASTNode} from "../node/RecursionASTNode";
import {AssignmentASTNode} from "../node/AssignmentASTNode";
import {BlockASTNode} from "../node/BlockASTNode";
import {ASTNodeVisitorContext} from "./ASTNodeVisitorContext";
import {VariableASTNode} from "../node/VariableASTNode";
import {ASTNode} from "../node/ASTNode";

class MissingTypeError extends Error {
    constructor(node: ASTNode) {
        super(`Type is not set on ${node}. Did you forget to visit with TypingASTNodeVisitor?`);
    }
}

class TypeAlreadySetError extends Error {
    constructor(node: ASTNode) {
        super(`Cannot set type on ${node}.  Node already has type ${node.type.toString()}`);
    }
}

class TypingASTNodeVisitor extends ASTNodeVisitor<Type> {

    public visitConst(node: ConstASTNode): Type {
        node.type = constType;
        return node.type;
    }

    visitSuccessor(node: SuccessorASTNode): Type {
        node.type = functionType(constType, constType);
        return node.type;
    }

    visitApplication(node: ApplicationASTNode): Type {
        let funcType = this.visit(node.func);
        let argTypes = node.args.map(arg => this.visit(arg));

        let appliedType: Type | null = funcType;
        for (let i = 0; i < argTypes.length; i++) {
            appliedType = appliedType.applyTo(argTypes[i]);
            if (!appliedType) {
                throw new StaticTypeError(`Cannot apply ${node.func.type.toString()} to ${node.args[i].type.toString()} at index ${i}.`);
            }
        }
        node.type = appliedType;

        return node.type;
    }

    visitProjection(node: ProjectionASTNode): Type {
        if (node.index >= node.arity) {
            throw new StaticTypeError("Projection index out of bounds");
        }
        let genericTypes = Array(node.arity).fill(0).map(() => genericType());
        genericTypes.push(genericTypes[node.index]);
        node.type = genericTypes.reverse().reduce((acc, x) => functionType(x, acc));
        return node.type;
    }

    visitComposition(node: CompositionASTNode): Type {
        let funcType = this.visit(node.func);
        let argTypes = node.args.map(arg => this.visit(arg));

        let argTypesArray = argTypes.map(a => [...a.types()]);
        let argTypesPrefixArray = argTypesArray.map(a => a.slice(0,-1));

        let unifierOrNull = Unifier.fromAll(...argTypesPrefixArray);
        if (!unifierOrNull) {
            throw new StaticTypeError(`Cannot compose functions. No valid unifier.`);
        }
        let unifier = unifierOrNull;
        let unifiedArgPrefixTypes = argTypesPrefixArray.map(t => unifier.applyTo(t));

        // If args[0].type == a -> b -> c
        // and args[1].type == a -> b -> d
        // and func.type == c -> d > e
        // then this.type == a -> b -> e

        // After unifying the args, all but the final types should be equal.
        if (unifiedArgPrefixTypes.length > 1) {
            for (let i = 1; i < unifiedArgPrefixTypes.length; i++) {
                if (!isEqual(unifiedArgPrefixTypes[0], unifiedArgPrefixTypes[i], (a,b) => a.equals(b))) {
                    throw new StaticTypeError("Cannot compose functions.  Inner composed functions have incompatible types.");
                }
            }
        }

        let funcTypes = [...funcType.types()];
        let typePrefixByArgs = argTypesArray.map(a => a.slice(-1)[0]);
        let typePrefixByFunc = funcTypes.slice(0,-1);
        let u = Unifier.from(typePrefixByArgs, typePrefixByFunc);
        if (!u) {
            throw new StaticTypeError("Cannot compose functions.  Outer composed function has incompatible types with inner functions");
        }
        if (!isEqual(u.applyTo(typePrefixByFunc), u.applyTo(typePrefixByArgs), (a:Type, b:Type) => a.equals(b))) {
            throw new StaticTypeError("Cannot compose functions.  Outer composed function has incompatible types with inner functions");
        }

        node.type = u.applyTo(from(argTypesPrefixArray[0].concat(funcTypes.slice(-1))));

        return node.type;
    }

    visitRecursion(node: RecursionASTNode): Type {
        let baseType = this.visit(node.base);
        let recursionType = this.visit(node.recursion);

        let baseTypes = [...baseType.types()];
        let recursionTypes = [...recursionType.types()];

        let unifier = Unifier.from(recursionTypes.slice(2), baseTypes);
        if (!unifier) {
            throw new StaticTypeError(`Invalid recursion. No valid unifier.`);
        }

        node.type = functionType(constType, unifier.applyTo(baseType));

        return node.type;
    }

    visitAssignment(node: AssignmentASTNode): Type {
        node.type = super.visitAssignment(node);
        return node.type;
    }

    visitBlock(node: BlockASTNode): Type {
        node.type = super.visitBlock(node);
        return node.type;
    }

    visitVariable(node: VariableASTNode) : Type {
        node.type = super.visitVariable(node);
        return node.type;
    }
}

export {TypingASTNodeVisitor, MissingTypeError, TypeAlreadySetError};