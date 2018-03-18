import {VariableASTNode} from "../node/VariableASTNode";

class InvalidContextError extends Error {
    public constructor(message: string) {
        super(message)
    }
}

class ASTNodeVisitorContext<T> {
    private outer: ASTNodeVisitorContext<T> | null = null;
    private context: Map<string, T> = new Map<string, T>();

    public get(variable: VariableASTNode): T | null {
        for (let c: ASTNodeVisitorContext<T> | null = this; c != null; c = c.outer) {
            let v = c.context.get(variable.name);
            if (v !== undefined) return v;
        }
        return null;
    }

    public set(variable: VariableASTNode, value: T): ASTNodeVisitorContext<T> {
        this.context.set(variable.name, value);
        return this
    }

    public push(): ASTNodeVisitorContext<T> {
        let c = new ASTNodeVisitorContext<T>();
        c.outer = this;
        return c;
    }

    public pop(): ASTNodeVisitorContext<T> {
        if (this.outer === null) {
            throw new InvalidContextError("Unable to pop context.  Already at root context");
        }
        return this.outer;
    }

}

export {ASTNodeVisitorContext, InvalidContextError};