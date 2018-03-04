"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FactoryMap = require("factory-map");
class StaticTypeError extends Error {
}
exports.StaticTypeError = StaticTypeError;
function isEqual(xs, ys, comparator) {
    if (xs.length !== ys.length)
        return false;
    for (let i = 0; i < xs.length; i++) {
        if (!comparator(xs[i], ys[i]))
            return false;
    }
    return true;
}
exports.isEqual = isEqual;
class Unifier {
    constructor(unifier = new Map()) {
        this.unifier = unifier;
    }
    ;
    static _unify_var(x, y, unifier) {
        let xVal = unifier.get(x);
        if (xVal)
            return Unifier._unify(xVal, y, unifier);
        let yVal = y instanceof GenericType && unifier.get(y);
        if (yVal)
            return Unifier._unify(x, yVal, unifier);
        if (y.contains(x))
            return null;
        unifier.set(x, y);
        return unifier;
    }
    static _unify(x, y, unifier) {
        if (!unifier)
            return null;
        if (Array.isArray(x) && Array.isArray(y)) {
            if (x.length != y.length)
                return null;
            if (x.length == 0 && y.length == 0)
                return unifier;
            if (isEqual(x, y, (a, b) => a.equals(b)))
                return unifier;
            return Unifier._unify(x.slice(1), y.slice(1), Unifier._unify(x[0], y[0], unifier));
        }
        if (!Array.isArray(x) && !Array.isArray(y)) {
            let xt = x;
            let yt = y;
            if (xt.equals(yt))
                return unifier;
            if (xt instanceof GenericType)
                return Unifier._unify_var(xt, yt, unifier);
            if (yt instanceof GenericType)
                return Unifier._unify_var(yt, xt, unifier);
            if (xt instanceof FunctionType && yt instanceof FunctionType)
                return Unifier._unify(xt.from, yt.from, Unifier._unify(xt.to, yt.to, unifier));
            return null;
        }
        return null;
    }
    static fromAll(...types) {
        if (types.length == 0) {
            return null;
        }
        let t = types[0];
        let u = new Map();
        for (let i = 1; i < types.length; i++) {
            u = Unifier._unify(t, types[i], u);
            if (!u)
                return null;
            t = new Unifier(u).applyTo(t);
        }
        return new Unifier(u);
    }
    static from(x, y) {
        let u = Unifier._unify(x, y, new Map());
        if (!u)
            return null;
        return new Unifier(u);
    }
    applyTo(x) {
        if (Array.isArray(x)) {
            return x.map((t) => this.applyTo(t));
        }
        else {
            let t = x;
            return t.apply(this.unifier);
        }
    }
    size() {
        return this.unifier.size;
    }
}
exports.Unifier = Unifier;
class FunctionType {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
    applyTo(type) {
        let unifier = Unifier.from(type, this.from);
        if (unifier) {
            return this.to;
        }
        else {
            return null;
        }
    }
    apply(unifier) {
        return functionType(this.from.apply(unifier), this.to.apply(unifier));
    }
    contains(type) {
        return this.from.contains(type) || this.to.contains(type);
    }
    *types() {
        yield this.from;
        yield* this.to.types();
    }
    toString(map) {
        if (!map) {
            let i = 0;
            map = new FactoryMap(() => {
                if (i >= GenericType.VARIABLE_NAME_POOL.length)
                    throw new Error('Type variables exhausted. The current implementation only supports types with up to 26 distinct generic types');
                return GenericType.VARIABLE_NAME_POOL[i++];
            });
        }
        return `(${this.from.toString(map)} -> ${this.to.toString(map)})`;
    }
    equals(other) {
        return other instanceof FunctionType &&
            this.from.equals(other.from) &&
            this.to.equals(other.to);
    }
}
class LeafType {
    contains(type) {
        return this.equals(type);
    }
    *types() {
        yield this;
    }
    equals(other) {
        return this === other;
    }
}
class ConstType extends LeafType {
    applyTo(type) {
        return null;
    }
    apply(unifier) {
        return this;
    }
    toString() {
        return '*';
    }
}
class GenericType extends LeafType {
    applyTo(type) {
        throw new Error("Method not implemented.");
    }
    apply(unifier) {
        return unifier.get(this) || this;
    }
    toString(map) {
        if (!map)
            return GenericType.VARIABLE_NAME_POOL[0];
        let s = map.get(this);
        if (!s) {
            throw new Error('Failed to generate GenericType name');
        }
        return s;
    }
}
GenericType.VARIABLE_NAME_POOL = 'abcdefghijklmnopqrstuvwxyz'.split('');
let constType = new ConstType();
exports.constType = constType;
let functionType = (from, to) => new FunctionType(from, to);
exports.functionType = functionType;
let genericType = () => new GenericType();
exports.genericType = genericType;
let from = (ts) => {
    if (ts.length == 0)
        throw new Error("Invalid Argument");
    if (ts.length == 1)
        return ts[0];
    return functionType(ts[0], from(ts.slice(1)));
};
exports.from = from;
