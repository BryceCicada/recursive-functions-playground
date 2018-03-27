let chai = require('chai');
let expect = chai.expect;

let {constType, functionType, genericType, Unifier} = require('../../../main/nodejs/type/Type');

describe('Type', function () {
    describe('constType', function () {
        describe('toString()', function () {
            it('toString() should be *', function () {
                expect(constType.toString()).to.eql('*');
            });
        });

        describe('applyTo()', function () {
            it('* is not applicable to * -> *', function () {
                let f = functionType(constType, constType);
                expect(constType.applyTo(f)).to.eql(null);
            });

            it('* is not applicable to a', function () {
                let a = genericType();
                expect(constType.applyTo(a)).to.eql(null);
            });
        });
    });

    describe('functionType', function () {
        describe('toString()', function () {
            it('toString() of * -> *', function () {
                let f = functionType(constType, constType);
                expect(f.toString()).to.eql('(* -> *)');
            });

            it('toString() of a -> a', function () {
                let g = genericType();
                let f = functionType(g, g);
                expect(f.toString()).to.eql('(a -> a)');
            });

            it('toString() of a -> b', function () {
                let f = functionType(genericType(), genericType());
                expect(f.toString()).to.eql('(a -> b)');
            });
        });

        describe('applyTo()', function () {
            it('* -> * is applicable to *', function () {
                let f = functionType(constType, constType);
                expect(f.applyTo(constType)).to.eql(constType);
            });

            it('(* -> *) -> * is applicable to * -> *', function () {
                let f = functionType(constType, constType);
                let g = functionType(f, constType);
                expect(g.applyTo(f)).to.eql(constType);
            });

            it('* -> * is not applicable to * -> *', function () {
                let f = functionType(constType, constType);
                expect(f.applyTo(f)).to.eql(null);
            });

            it('a -> * is applicable to a', function () {
                let f = functionType(genericType(), constType);
                expect(f.applyTo(genericType())).to.eql(constType);
            });

            it('a -> * is applicable to *', function () {
                let f = functionType(genericType(), constType);
                expect(f.applyTo(constType)).to.eql(constType);
            });

            it('a -> * is applicable to * -> *', function () {
                let f = functionType(genericType(), constType);
                let g = functionType(constType, constType);
                expect(f.applyTo(g)).to.eql(constType);
            });

        });
    });

    describe('genericType', function () {
        it('toString() of a', function () {
            let f = genericType();
            expect(f.toString()).to.eql('a');
        });
    });

    describe('Unifier', function () {
        describe('genericType', function () {
            it('unify [*,*] returns {}', function () {
                expect(Unifier.from(constType, constType).size()).to.eql(0);
            });

            it('unify [a,*] returns {a: *}', function () {
                let a = genericType();
                let unifier = Unifier.from(a, constType);
                expect(unifier.size()).to.eql(1);
                expect(unifier.applyTo(a)).to.eql(constType);
            });

            it('unify [*,a] returns {a: *}', function () {
                let a = genericType();
                let unifier = Unifier.from(constType, a);
                expect(unifier.size()).to.eql(1);
                expect(unifier.applyTo(a)).to.eql(constType);
            });

            it('unify [a,*->*] returns {a: *->*}', function () {
                let g = genericType();
                let f = functionType(constType, constType);
                let unifier = Unifier.from(f, g);
                expect(unifier.size()).to.eql(1);
                expect(unifier.applyTo(g)).to.eql(f);
            });

            it('unify [a,a->*] returns null', function () {
                let a = genericType();
                let f = functionType(a, constType);
                let unifier = Unifier.from(f, a);
                expect(unifier).to.eql(null);
            });

            it('unify [a,b->*] returns {a: b->*}', function () {
                let a = genericType();
                let b = genericType();
                let f = functionType(b, constType);
                let unifier = Unifier.from(f, a);
                expect(unifier.size()).to.eql(1);
                expect(unifier.applyTo(a)).to.eql(f);
            });

            it('unify [a->a,b->*] returns {a: *, b: *}', function () {
                let a = genericType();
                let b = genericType();
                let f1 = functionType(a, a);
                let f2 = functionType(b, constType);
                let unifier = Unifier.from(f1, f2);
                expect(unifier.size()).to.eql(2);
                expect(unifier.applyTo(a)).to.eql(constType);
                expect(unifier.applyTo(b)).to.eql(constType);
            });

            it('unify [a->b,(*->*)->c] returns {a:*->*, b->c}', function () {
                let a = genericType();
                let b = genericType();
                let c = genericType();
                let f1 = functionType(a, b);
                let f2 = functionType(constType, constType);
                let f3 = functionType(f2, c);
                let unifier = Unifier.from(f1, f3);
                expect(unifier.size()).to.eql(2);
                expect(unifier.applyTo(a)).to.eql(f2);
                expect(unifier.applyTo(b) === c || unifier.get(c) === b).to.eql(true);
            });

            it('unify [a->b,a->a] returns {a: b}', function () {
                let a = genericType();
                let b = genericType();
                let f1 = functionType(a, a);
                let f2 = functionType(a, b);
                let unifier = Unifier.from(f1, f2);
                expect(unifier.size()).to.eql(1);
                expect(unifier.applyTo(a)).to.eql(b);
            });

        });

        describe('fromAll', function () {
            it('unify nothing returns null', function () {
                expect(Unifier.fromAll()).to.eql(null);
            });

            it('unify [*] returns {}', function () {
                expect(Unifier.fromAll(constType).size()).to.eql(0);
            });

            it('unify [a->b,a->a,c] returns {a: b, c:b->b}', function () {
                let a = genericType();
                let b = genericType();
                let c = genericType();
                let f1 = functionType(a, a);
                let f2 = functionType(a, b);
                let unifier = Unifier.fromAll(f1, f2, c);
                expect(unifier.size()).to.eql(2);
                expect(unifier.applyTo(a)).to.eql(b);
                expect(unifier.applyTo(c)).to.eql(functionType(b, b));
            });
        });

        describe('merge', function () {
            it('merge unifier for [*,*] and [*,*] returns {}', function () {
                let u1 = Unifier.from(constType, constType);
                let u2 = Unifier.from(constType, constType);
                let u3 = Unifier.merge(u1,u2);
                expect(u3.size()).to.eql(0);
            });

            it('merge unifier for [a,*] and [*,*] returns {a: *}', function () {
                let a = genericType();
                let u1 = Unifier.from(a, constType);
                let u2 = Unifier.from(constType, constType);
                let u3 = Unifier.merge(u1,u2);
                expect(u3.size()).to.eql(1);
                expect(u3.applyTo(a)).to.eql(constType);
            });

            it('merge unifier for [a,*] and [a,*] returns {a: *}', function () {
                let a = genericType();
                let u1 = Unifier.from(a, constType);
                let u2 = Unifier.from(a, constType);
                let u3 = Unifier.merge(u1,u2);
                expect(u3.size()).to.eql(1);
                expect(u3.applyTo(a)).to.eql(constType);
            });

            it('merge unifier for [a,*] and [b,*] returns {a: *, b: *}', function () {
                let a = genericType();
                let b = genericType();
                let u1 = Unifier.from(a, constType);
                let u2 = Unifier.from(b, constType);
                let u3 = Unifier.merge(u1,u2);
                expect(u3.size()).to.eql(2);
                expect(u3.applyTo(a)).to.eql(constType);
                expect(u3.applyTo(b)).to.eql(constType);
            });

            it('merge unifier for [a,*] and [b,*->*] returns {a: *, b: *->*}', function () {
                let a = genericType();
                let b = genericType();
                let f = functionType(constType, constType);
                let u1 = Unifier.from(a, constType);
                let u2 = Unifier.from(b, f);
                let u3 = Unifier.merge(u1,u2);
                expect(u3.size()).to.eql(2);
                expect(u3.applyTo(a)).to.eql(constType);
                expect(u3.applyTo(b)).to.eql(f);
            });

            it('merge unifier for [a,*] and [a,*->*] returns {a: *, b: *->*}', function () {
                let a = genericType();
                let f = functionType(constType, constType);
                let u1 = Unifier.from(a, constType);
                let u2 = Unifier.from(a, f);
                let u3 = Unifier.merge(u1,u2);
                expect(u3).to.eql(null);
            });

        });

    });
});
