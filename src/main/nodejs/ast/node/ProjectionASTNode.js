"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Type_1 = require("../../type/Type");
class ProjectionASTNode {
    constructor(arity, index) {
        this.arity = arity;
        this.index = index;
    }
    accept(visitor) {
        return visitor.visitProjection(this);
    }
    get type() {
        if (!this._type) {
            if (this.index >= this.arity) {
                throw new Type_1.StaticTypeError("Projection index out of bounds");
            }
            let genericTypes = Array(this.arity).fill(0).map(() => Type_1.genericType());
            genericTypes.push(genericTypes[this.index]);
            this._type = genericTypes.reverse().reduce((acc, x) => Type_1.functionType(x, acc));
        }
        return this._type;
    }
}
exports.ProjectionASTNode = ProjectionASTNode;
