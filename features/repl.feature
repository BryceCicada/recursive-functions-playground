Feature: REPL should evaluate simple expressions
  As a user
  I want the REPL to evaluate simple expressions
  So that I can use the language via a interactive interface

  @const
  Scenario Outline: REPL should evaluate const expressions
    Given a REPL
    When I input <input>
    Then I get <output>

    Examples:
      | input | output |
      | 0     | 0: *   |
      | 1     | 1: *   |

  @successor
  Scenario Outline: REPL should evaluate successor expressions
    Given a REPL
    When I input <input>
    Then I get <output>

    Examples:
      | input   | output      |
      | S       | S: (* -> *) |
      | S(0)    | 1: *        |
      | S(S(0)) | 2: *        |

  @projection
  Scenario Outline: REPL should evaluate projection expressions
    Given a REPL
    When I input <input>
    Then I get <output>

    Examples:
      | input      | output              |
      | P^1_0      | P^1_0: (a -> a)     |
      | P^2_0      | P^2_0: ((a,b) -> a) |
      | P^2_0(0,0) | 0: *                |

  @composition
  Scenario Outline: REPL should evaluate composition expressions
    Given a REPL
    When I input <input>
    Then I get <output>

    Examples:
      | input                          | output                                  |
      | S.(S)                          | S.(S): (* -> *)                         |
      | P^2_0.(S,S)                    | P^2_0.(S,S): (* -> *)                   |
      | P^2_0.(P^3_1,P^3_2)            | P^2_0.(P^3_1,P^3_2): ((a,b,c) -> b)     |
      | S.(P^2_0.(P^3_1,P^3_2))        | S.(P^2_0.(P^3_1,P^3_2)): ((a,*,b) -> *) |
      | S.(P^2_0.(P^3_1,P^3_2))(0,2,4) | 3: *                                    |

  @recursion
  Scenario Outline: REPL should evaluate recursion expressions
    Given a REPL
    When I input <input>
    Then I get <output>

    Examples:
      | input                | output                          |
      | P^1_0:S.(P^3_1)      | (P^1_0:S.(P^3_1)): ((*,*) -> *) |
      | P^1_0:S.(P^3_1)(0,1) | 1: *                            |
      | P^1_0:S.(P^3_1)(2,3) | 5: *                            |

  @block
  Scenario Outline: REPL should evaluate block expressions
    Given a REPL
    When I input <input>
    Then I get <output>

    Examples:
      | input                                        | output                          |
      | let a = 0 in 1                               | 1: *                            |
      | let a = 0 in a                               | 0: *                            |
      | let id=P^1_0 in id(2)                        | 2: *                            |
      | let id=P^1_0, add=id:S.(P^3_1) in add(2,3)   | 5: *                            |
      | let id=P^1_0, add=id:S.(P^3_1) in add        | (P^1_0:S.(P^3_1)): ((*,*) -> *) |
      | (let id=P^1_0, add=id:S.(P^3_1) in add)(2,3) | 5: *                            |

  Scenario Outline: REPL should handle newlines and spaces
    Given a REPL
    When I input <input>
    Then I get <output>

    Examples:
      | input            | output |
      | let a = 0 in a   | 0: *   |
      | let   a = 0 in a | 0: *   |
      | let a   = 0 in a | 0: *   |
      | let a =   0 in a | 0: *   |
      | let a = 0   in a | 0: *   |
      | let a = 0 in   a | 0: *   |
      | let\na = 0 in a  | 0: *   |
      | let a\n= 0 in a  | 0: *   |
      | let a =\n0 in a  | 0: *   |
      | let a = 0\nin a  | 0: *   |
      | let a = 0 in\na  | 0: *   |

  @bracket
  Scenario Outline: REPL should handle bracket expressions
    Given a REPL
    When I input <input>
    Then I get <output>

    Examples:
      | input               | output                          |
      | (0)                 | 0: *                            |
      | ((0))               | 0: *                            |
      | (S)                 | S: (* -> *)                     |
      | (S(0))              | 1: *                            |
      | (S(S(0)))           | 2: *                            |
      | (S.(S))             | S.(S): (* -> *)                 |
      | (P^1_0):(S).(P^3_2) | (P^1_0:S.(P^3_2)): ((*,*) -> *) |

