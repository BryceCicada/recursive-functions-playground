# Recursive Function Playground

Primitive recursive function (PRF) interpreter in NodeJS

https://en.wikipedia.org/wiki/Primitive_recursive_function

# Why does this exist?

Somewhere for me to play with writing my own language.

Somewhere for me and others to play with primitive recursive functions.

# Usage

## Setup

```
npm install
```

## Running

```
npm start
```

which is equivalent to

```
npm run compile
node src/main/nodejs/recfun.js
```

## Tests

```
npm test
```



# Introduction

The language is made up of:
  - A 0-ary constant function, `0`
  - A 1-ary successor function, `S` that takes an argument, _n_, and returns _n+1_.
  - n-ary projection functions, _P^n_i_ that take n arguments and return the ith (indexed from 0), eg `P^1_0`, `P^2_0`, `P^2_1`.
  - A composition operator `.` to compose functions.
  - A recursion operator `:` used to apply primitive recursion.
  - A 'let \<definitions\> in \<expression\>' construct that allows the definition of named expressions that can be used (by substitution) in a final expression.

The 0-ary constant function is represented by `0`.  The constant type is represented by `*`
```
> 0
0: *
```
Normally, when reading examples of PRFs, the types are implicit.  We'll make them explicit when outputting expressions.  The type is not part of the expression to be input.

Often, in formalisms of PRFs, the symbol '0' represents either a 1-ary or n-ary constant zero function.  Note that, here, `0` is 0-ary, ie a constant function with no arguments..

The 1-ary successor function is represented by `S`.  
```
> S
S: (* -> *)
> S(0)
1: *
```
The example above demonstrates:
  - Function application is achieved by giving a function name, followed by arguments in brackets.  In general, multiple arguments will be separated by commas.
  - We have a 0-ary constant function `1`. Contrary to common definitions of PRFs, which usually define only the zero constant function as a base expression, we'll allow other constant functions.  Hopefully, this isn't too much of a concession to purists.
  - We have a function type `(* -> *)` for functions that take a constant argument and return a constant.

The n-ary projection function that returns the i-th argument is represented by _P^n_i_.
```
> P^2_0
P^2_0: ((a,b) -> a)
> P^2_0(1,2)
1: *
> P^2_1(1,2)
2: *
```
The example above shows that we have generic types `a` and `b`. These are not types themselves (we have only function types and the constant type), but place-holders in the type system for an as yet unknown type.  `P^2_0: ((a,b) -> a)` shows that `P^2_0` is a function that takes any two arguments, it doesn't matter what type they are, and the resulting type is the same as the type of the first argument. 

Function composition operator is represented by `.` symbol. For example, the function that takes two arguments and applies the successor function to the first is:
```
> S.(P^2_0)
S.(P^2_0): ((*,a) -> *)
> (S.(P^2_0))(1,3)
2: *
```
Notice the type inference in `S.(P^2_0): ((*,a) -> *)`

As a convenience we can assign function expressions to names in a 'let' function.  For example, to define the identity function _id_ in terms of the projection function _P^1_0_:
```
> let id=P^1_0 in id(1)
1: *
```
We call it a 'let' _function_ because the expression is a function expression in it's own right.
```
> let id=P^1_0 in id
P^1_0: (a -> a)
> (let id=P^1_0 in id)(1)
1: *
```

Multiple defines can be made in a single 'let' function by separating the defines with a comma.  Later defines can refer to earlier defines within the same 'let' function.

Now for the fun bit.  Function recursion is represented by `:` symbol.  On each side of `:` is a function.  

  - The left side is an n-ary base-case function, _f_.  
  - The right side is an (n+2)-ary recursion function, _g_.
  - The resulting function is an (n+1)-ary function, h, that takes arguments _ctr, x1, x2, ..., xn_, where ctr is a recursion counter.  Function _h_ is defined from _f_ and _g_ as follows:
    - _h(0, x1, x2, ..., xn)_ = _f(x_1, x_2, ..., x_n)_
    - _h(y, x1, x2, ..., xn)_ = _g(y-1, h(y-1, x1, x2, ..., xn), x1, x2, ..., xn)_
  - That is, for the base-case function _f_:
    - The arguments are those of _h_, except the first. 
  - That is, for the recursion function _g_:
    - The first argument is the recursion counter, decrementing on each recursive call.
    - The second argument is the result of recursively calling h with recursion counter decremented.
    - The remaining arguments are those of _h_, except the first.

And that's it.

## Examples

See examples folder.

