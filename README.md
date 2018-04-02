# Recursive Function Playground

Primitive recursive function (PRF) interpreter in NodeJS

https://en.wikipedia.org/wiki/Primitive_recursive_function

# Why does this exist?

Somewhere for me to play with writing my own language.

Somewhere for me and others to play with recursive functions.

## Introduction

The 0-ary constant function is represented by `0`.  The constant type is represented by `*`
```
> 0
0: *
```
Normally, when reading examples of PRFs, the types are implicit.  We'll make them explicit when outputting expressions.  The type is not part of the expression to be input.

Often, in formalisms of PRFs, the symbol '0' represents either a 1-ary or n-ary constant zero function.  Note that, here, `0` is 0-ary, ie a constant function with no arguments.  More on this later. 

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

The n-ary projection function that returns the i-th argument is represented by _P^n_i_, eg `P^1_0`, `P^2_0`, `P^2_1`, etc
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

As a convenience we can substitution variables in a 'let' function.  For example, to define the identity function _id_ in terms of the projection function _P^1_0_:
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

Multiple variables can be defined in a single 'let' function by separating the assignments with a comma.  Later variables can refer to earlier variables.

Now for the fun bit.  Function recursion is represented by `:` symbol.  On each side of `:` is a function.  

  - The left side is an n-ary base case function, f.  
  - The right side is an (n+2)-ary recursion function, g.
  - The resulting function is an (n+1)-ary function, h, that takes arguments _ctr, x1, x2, ..., xn_, where ctr is a recursion counter.  A semi-formal definition of h is as follows:
    - h(0, x1, x2, ..., xn) = f(x_1, x_2, ..., x_n)
    - h(y, x1, x2, ..., xn) = g(y-1, h(y-1, x1, x2, ..., xn), x1, x2, ..., xn)
  - That is,
    - The first argument of g is the recursion counter, decrementing on each call.
    - The second argument of g is the result of recursively calling h with recursion counter decremented.

For example, the addition function _add_ can defined as:
```
 > let id=P^1_0, add=id:S.(P^3_1) in add
(P^1_0:S.(P^3_1)): ((*,*) -> *)
> (let id=P^1_0, add=id:S.(P^3_1) in add)(2,3)
5: *
```

## Examples

See examples folder.

