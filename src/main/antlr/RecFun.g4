grammar RecFun;

NUMBER: ('0' .. '9')+ ;
SUCCESSOR: 'S';
PROJECTION: 'P';
VAR:  [A-Za-z][A-Za-z0-9_]*;

WS: [ \t]+ -> skip;
SKP: [\r]+ -> skip;

parse
 : func* EOF
 ;

assignment
 : VAR '=' func
 ;

func
 : NUMBER                                        # Const
 | SUCCESSOR                                     # Successor
 | PROJECTION '^' NUMBER '_' NUMBER              # Projection
 | VAR                                           # Variable
 | func '.' '(' func (',' func)* ')'             # Composition
 | func ':' func                                 # Recursion
 | func '(' func (',' func)* ')'                 # Application
 | 'let' assignment (',' assignment)* 'in' func  # Block
 ;