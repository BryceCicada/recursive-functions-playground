grammar RecFun;

NUMBER: ('0' .. '9')+ ;

parse
 : func* EOF
 ;

func
 : NUMBER                                    # Const
 | 'S'                                       # Successor
 | 'P^' NUMBER '_' NUMBER                    # Projection
 | func '.' '(' func (',' func)* ')'         # Composition
 | func ':' func                             # Recursion
 | func '(' func (',' func)* ')'             # Application
 ;