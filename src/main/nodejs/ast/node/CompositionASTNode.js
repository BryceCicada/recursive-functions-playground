"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Type_1 = require("../../type/Type");
class CompositionASTNode {
    constructor(func, args) {
        this.func = func;
        this.args = args;
    }
    accept(visitor) {
        return visitor.visitComposition(this);
    }
    get type() {
        if (!this._type) {
            let argTypes = this.args.map(a => [...a.type.types()]);
            let argTypesPrefixArray = argTypes.map(a => a.slice(0, -1));
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
            let funcTypes = [...this.func.type.types()];
            let typePrefixByArgs = argTypes.map(a => a.slice(-1)[0]);
            let typePrefixByFunc = funcTypes.slice(0, -1);
            let u = Type_1.Unifier.from(typePrefixByArgs, typePrefixByFunc);
            if (!u) {
                throw new Type_1.StaticTypeError("Cannot compose functions.  Outer composed function has incompatible types with inner functions");
            }
            if (!Type_1.isEqual(u.applyTo(typePrefixByFunc), u.applyTo(typePrefixByArgs), (a, b) => a.equals(b))) {
                throw new Type_1.StaticTypeError("Cannot compose functions.  Outer composed function has incompatible types with inner functions");
            }
            this._type = u.applyTo(Type_1.from(argTypesPrefixArray[0].concat(funcTypes.slice(-1))));
        }
        return this._type;
    }
}
exports.CompositionASTNode = CompositionASTNode;
