"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ASTNodeVisitor_1 = require("./ASTNodeVisitor");
const Type_1 = require("../../type/Type");
class MissingTypeError extends Error {
    constructor(node) {
        super(`Type is not set on ${node}. Did you forget to visit with TypingASTNodeVisitor?`);
    }
}
exports.MissingTypeError = MissingTypeError;
class TypeAlreadySetError extends Error {
    constructor(node) {
        super(`Cannot set type on ${node}.  Node already has type ${node.type.toString()}`);
    }
}
exports.TypeAlreadySetError = TypeAlreadySetError;
class TypingASTNodeVisitor extends ASTNodeVisitor_1.ASTNodeVisitor {
    visitConst(node) {
        node.type = Type_1.constType;
        return node.type;
    }
    visitSuccessor(node) {
        node.type = Type_1.functionType(Type_1.constType, Type_1.constType);
        return node.type;
    }
    visitApplication(node) {
        let funcType = this.visit(node.func);
        let argTypes = node.args.map(arg => this.visit(arg));
        let appliedType = funcType;
        for (let i = 0; i < argTypes.length; i++) {
            appliedType = appliedType.applyTo(argTypes[i]);
            if (!appliedType) {
                throw new Type_1.StaticTypeError(`Cannot apply ${node.func.type.toString()} to ${node.args[i].type.toString()} at index ${i}.`);
            }
        }
        node.type = appliedType;
        return node.type;
    }
    visitProjection(node) {
        if (node.index >= node.arity) {
            throw new Type_1.StaticTypeError("Projection index out of bounds");
        }
        let genericTypes = Array(node.arity).fill(0).map(() => Type_1.genericType());
        genericTypes.push(genericTypes[node.index]);
        node.type = genericTypes.reverse().reduce((acc, x) => Type_1.functionType(x, acc));
        return node.type;
    }
    visitComposition(node) {
        let funcType = this.visit(node.func);
        let argTypes = node.args.map(arg => this.visit(arg));
        let argTypesArray = argTypes.map(a => [...a.types()]);
        let argTypesPrefixArray = argTypesArray.map(a => a.slice(0, -1));
        let unifierOrNull = Type_1.Unifier.fromAll(...argTypesPrefixArray);
        if (!unifierOrNull) {
            throw new Type_1.StaticTypeError(`Cannot compose functions. No valid unifier.`);
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
                if (!Type_1.isEqual(unifiedArgPrefixTypes[0], unifiedArgPrefixTypes[i], (a, b) => a.equals(b))) {
                    throw new Type_1.StaticTypeError("Cannot compose functions.  Inner composed functions have incompatible types.");
                }
            }
        }
        let funcTypes = [...funcType.types()];
        let typePrefixByArgs = argTypesArray.map(a => a.slice(-1)[0]);
        let typePrefixByFunc = funcTypes.slice(0, -1);
        let u = Type_1.Unifier.from(typePrefixByArgs, typePrefixByFunc);
        if (!u) {
            throw new Type_1.StaticTypeError("Cannot compose functions.  Outer composed function has incompatible types with inner functions");
        }
        if (!Type_1.isEqual(u.applyTo(typePrefixByFunc), u.applyTo(typePrefixByArgs), (a, b) => a.equals(b))) {
            throw new Type_1.StaticTypeError("Cannot compose functions.  Outer composed function has incompatible types with inner functions");
        }
        node.type = u.applyTo(Type_1.from(argTypesPrefixArray[0].concat(funcTypes.slice(-1))));
        return node.type;
    }
    visitRecursion(node) {
        let baseType = this.visit(node.base);
        let recursionType = this.visit(node.recursion);
        let baseTypes = [...baseType.types()];
        let recursionTypes = [...recursionType.types()];
        let unifier = Type_1.Unifier.from(recursionTypes.slice(2), baseTypes);
        if (!unifier) {
            throw new Type_1.StaticTypeError(`Invalid recursion. No valid unifier.`);
        }
        node.type = Type_1.functionType(Type_1.constType, unifier.applyTo(baseType));
        return node.type;
    }
    visitAssignment(node) {
        node.type = super.visitAssignment(node);
        return node.type;
    }
    visitBlock(node) {
        node.type = super.visitBlock(node);
        return node.type;
    }
    visitVariable(node) {
        node.type = super.visitVariable(node);
        return node.type;
    }
}
exports.TypingASTNodeVisitor = TypingASTNodeVisitor;
