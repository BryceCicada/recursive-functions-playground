"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Type_1 = require("../../type/Type");
class ApplicationASTNode {
    constructor(func, args) {
        this.func = func;
        this.args = args;
    }
    accept(visitor) {
        return visitor.visitApplication(this);
    }
    get type() {
        if (!this._type) {
            let appliedType = this.func.type;
            for (let i = 0; i < this.args.length; i++) {
                appliedType = appliedType.applyTo(this.args[i].type);
                if (!appliedType) {
                    throw new Type_1.StaticTypeError(`Cannot apply ${this.func.type.toString()} to ${this.args[i].type.toString()} at index ${i}.`);
                }
            }
            this._type = appliedType;
        }
        return this._type;
    }
}
exports.ApplicationASTNode = ApplicationASTNode;
