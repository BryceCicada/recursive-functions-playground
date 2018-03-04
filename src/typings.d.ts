declare module 'unify';
declare module 'RecFunLexer';
declare module 'factory-map' {
    class FactoryMap<K,V> extends Map<K,V> {
        constructor(f: (k:K) => V | undefined)
        get(key: K) : V | undefined
        get(key: K, defaultValueFactory: (k:K) => V | undefined) : V | undefined
    }

    export = FactoryMap;
}