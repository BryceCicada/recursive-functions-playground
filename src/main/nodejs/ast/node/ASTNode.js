"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypingASTNodeVisitor_1 = require("../visit/TypingASTNodeVisitor");
class ASTNode {
    get type() {
        if (!this._type) {
            throw new TypingASTNodeVisitor_1.MissingTypeError(this);
        }
        return this._type;
    }
    set type(type) {
        if (this._type) {
            throw new TypingASTNodeVisitor_1.TypeAlreadySetError(this);
        }
        this._type = type;
    }
}
exports.ASTNode = ASTNode;
