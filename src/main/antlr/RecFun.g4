grammar RecFun;

WS: [ \t]+ -> skip;
NEWLINE: '\r'? '\n' -> skip;

NUMBER: ('0' .. '9')+ ;
SUCCESSOR: 'S';
PROJECTION: 'P';
LET: 'let';
IN: 'in';
VAR:  [A-Za-z][A-Za-z0-9_]*;

COMMENT: '#' ~( '\r' | '\n' )* -> skip;

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
 | LET assignment (',' assignment)* IN func      # Block
 | '(' func ')'                                  # Bracket
 ;
