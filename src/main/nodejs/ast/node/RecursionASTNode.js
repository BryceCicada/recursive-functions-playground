"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Type_1 = require("../../type/Type");
class RecursionASTNode {
    constructor(base, recursion) {
        this.base = base;
        this.recursion = recursion;
    }
    accept(visitor) {
        return visitor.visitRecursion(this);
    }
    get type() {
        let baseTypes = [...this.base.type.types()];
        let recursionTypes = [...this.recursion.type.types()];
        let unifier = Type_1.Unifier.from(baseTypes, recursionTypes.slice(2));
        if (!unifier) {
            throw new Type_1.StaticTypeError(`Invalid recursion. No valid unifier.`);
        }
        return Type_1.functionType(Type_1.constType, unifier.applyTo(this.base.type));
    }
}
exports.RecursionASTNode = RecursionASTNode;
