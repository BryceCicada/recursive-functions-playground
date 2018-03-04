import FactoryMap = require('factory-map');

class StaticTypeError extends Error {
}

function isEqual<T>(xs: T[], ys: T[], comparator: ((x: T, y: T) => boolean)): boolean {
    if (xs.length !== ys.length) return false;
    for (let i = 0; i < xs.length; i++) {
        if (!comparator(xs[i], ys[i])) return false;
    }
    return true;
}

interface Type {
    applyTo(type: Type): Type | null

    apply(unifier: Map<GenericType, Type>): Type

    contains(type: Type): boolean

    types(): IterableIterator<Type>

    toString(map?: Map<GenericType, string>): string

    equals(other: Type): boolean
}

class Unifier {
    private constructor(private readonly unifier = new Map<GenericType, Type>()) {
    };

    private static _unify_var(x: GenericType, y: Type, unifier: Map<GenericType, Type>): Map<GenericType, Type> | null {
        let xVal = unifier.get(x);
        if (xVal) return Unifier._unify(xVal, y, unifier);
        let yVal = y instanceof GenericType && unifier.get(y);
        if (yVal) return Unifier._unify(x, yVal, unifier);
        if (y.contains(x)) return null;
        unifier.set(x, y);
        return unifier
    }

    private static _unify<T extends Type | Type[]>(x: T, y: T, unifier: Map<GenericType, Type> | null): Map<GenericType, Type> | null {
        if (!unifier) return null;
        if (Array.isArray(x) && Array.isArray(y)) {
            if (x.length != y.length) return null;
            if (x.length == 0 && y.length == 0) return unifier;
            if (isEqual(x, y, (a: Type, b: Type) => a.equals(b))) return unifier;
            return Unifier._unify(x.slice(1), y.slice(1), Unifier._unify(x[0], y[0], unifier));
        }
        if (!Array.isArray(x) && !Array.isArray(y)) {
            let xt = x as Type;
            let yt = y as Type;
            if (xt.equals(yt)) return unifier;
            if (xt instanceof GenericType) return Unifier._unify_var(xt, yt, unifier);
            if (yt instanceof GenericType) return Unifier._unify_var(yt, xt, unifier);
            if (xt instanceof FunctionType && yt instanceof FunctionType)
                return Unifier._unify(xt.from, yt.from, Unifier._unify(xt.to, yt.to, unifier));
            return null;
        }
        return null;
    }

    public static fromAll(...types: (Type | Type[])[]): Unifier | null {
        if (types.length == 0) {
            return null;
        }
        let t = types[0];
        let u: Map<GenericType, Type> | null = new Map<GenericType, Type>();
        for (let i = 1; i < types.length; i++) {
            u = Unifier._unify(t, types[i], u);
            if (!u) return null;
            t = new Unifier(u).applyTo(t);
        }
        return new Unifier(u);
    }

    public static from<T extends Type | Type[]>(x: T, y: T): Unifier | null {
        let u = Unifier._unify(x, y, new Map<GenericType, Type>());
        if (!u) return null;
        return new Unifier(u);
    }

    public applyTo<T extends Type | Type[]>(x: T): T {
        if (Array.isArray(x)) {
            return x.map((t: Type): Type => this.applyTo(t)) as T;
        } else {
            let t = x as Type;
            return t.apply(this.unifier) as T;
        }
    }

    public size(): number {
        return this.unifier.size;
    }


}

class FunctionType implements Type {

    constructor(public readonly from: Type, public readonly to: Type) {
    }

    public applyTo(type: Type): Type | null {
        let unifier = Unifier.from(type, this.from);
        if (unifier) {
            return this.to;
        } else {
            return null;
        }
    }

    public apply(unifier: Map<GenericType, Type>): Type {
        return functionType(this.from.apply(unifier), this.to.apply(unifier));
    }

    public contains(type: Type): boolean {
        return this.from.contains(type) || this.to.contains(type);
    }

    public * types(): IterableIterator<Type> {
        yield this.from;
        yield* this.to.types();
    }

    public toString(map?: Map<GenericType, string>): string {
        if (!map) {
            let i = 0;
            map = new FactoryMap<GenericType, string>(() => {
                if (i >= GenericType.VARIABLE_NAME_POOL.length)
                    throw new Error('Type variables exhausted. The current implementation only supports types with up to 26 distinct generic types');
                return GenericType.VARIABLE_NAME_POOL[i++];
            });
        }
        return `(${this.from.toString(map)} -> ${this.to.toString(map)})`;
    }

    public equals(other: Type): boolean {
        return other instanceof FunctionType &&
            this.from.equals(other.from) &&
            this.to.equals(other.to);
    }
}

abstract class LeafType implements Type {

    abstract toString(map?: Map<GenericType, string> | undefined): string

    abstract apply(unifier: Map<GenericType, Type>): Type

    abstract applyTo(type: Type): Type | null

    public contains(type: Type): boolean {
        return this.equals(type);
    }

    public * types(): IterableIterator<Type> {
        yield this;
    }

    equals(other: Type): boolean {
        return this === other;
    }
}

class ConstType extends LeafType {

    public applyTo(type: Type): Type | null {
        return null;
    }

    public apply(unifier: Map<GenericType, Type>): Type {
        return this;
    }

    public toString(): string {
        return '*';
    }
}

class GenericType extends LeafType {
    static VARIABLE_NAME_POOL = 'abcdefghijklmnopqrstuvwxyz'.split('');

    public applyTo(type: Type): Type | null {
        throw new Error("Method not implemented.");
    }

    public apply(unifier: Map<GenericType, Type>): Type {
        return unifier.get(this) || this;
    }

    public toString(map?: Map<GenericType, string>): string {
        if (!map) return GenericType.VARIABLE_NAME_POOL[0];
        let s = map.get(this);
        if (!s) {
            throw new Error('Failed to generate GenericType name');
        }
        return s;
    }
}

let constType = new ConstType();
let functionType = (from: Type, to: Type) => new FunctionType(from, to);
let genericType = () => new GenericType();
let from = (ts: Type[]): Type => {
    if (ts.length == 0) throw new Error("Invalid Argument");
    if (ts.length == 1) return ts[0];
    return functionType(ts[0], from(ts.slice(1)));
};
export {Type, constType, functionType, genericType, StaticTypeError, Unifier, from, isEqual};
