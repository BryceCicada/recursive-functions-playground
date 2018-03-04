import {ASTNode} from "./ASTNode";
import {ASTNodeVisitor} from "../visit/ASTNodeVisitor";
import {StaticTypeError, Type, Unifier, from, isEqual} from "../../type/Type";

class CompositionASTNode implements ASTNode {
    private _type: Type | undefined;

    constructor(public readonly func: ASTNode, public readonly args: ASTNode[]) {
    }

    accept<T>(visitor: ASTNodeVisitor<T>): T {
        return visitor.visitComposition(this);
    }

    get type(): Type {
        if (!this._type) {
            let argTypes = this.args.map(a => [...a.type.types()]);
            let argTypesPrefixArray = argTypes.map(a => a.slice(0,-1));

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

            let funcTypes = [...this.func.type.types()];
            let typePrefixByArgs = argTypes.map(a => a.slice(-1)[0]);
            let typePrefixByFunc = funcTypes.slice(0,-1);
            let u = Unifier.from(typePrefixByArgs, typePrefixByFunc);
            if (!u) {
                throw new StaticTypeError("Cannot compose functions.  Outer composed function has incompatible types with inner functions");
            }
            if (!isEqual(u.applyTo(typePrefixByFunc), u.applyTo(typePrefixByArgs), (a:Type, b:Type) => a.equals(b))) {
                throw new StaticTypeError("Cannot compose functions.  Outer composed function has incompatible types with inner functions");
            }

            this._type = u.applyTo(from(argTypesPrefixArray[0].concat(funcTypes.slice(-1))));

        }
        return this._type;
    }
}

export {CompositionASTNode};
