export type AngleMode = "deg" | "rad";

type Token =
  | { type: "number"; value: number }
  | { type: "identifier"; value: string }
  | { type: "operator"; value: string }
  | { type: "paren"; value: "(" | ")" };

const EPSILON = 1e-10;

function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < expression.length) {
    const char = expression[index];

    if (/\s/.test(char)) {
      index += 1;
      continue;
    }

    if (/[0-9.]/.test(char)) {
      const slice = expression.slice(index);
      const match = slice.match(/^(?:\d+\.\d*|\d+|\.\d+)(?:e[+-]?\d+)?/i);
      if (!match) {
        throw new Error("Invalid number.");
      }

      tokens.push({ type: "number", value: Number(match[0]) });
      index += match[0].length;
      continue;
    }

    if (/[a-z]/i.test(char)) {
      const slice = expression.slice(index);
      const match = slice.match(/^[a-z]+/i);
      if (!match) {
        throw new Error("Invalid identifier.");
      }

      tokens.push({ type: "identifier", value: match[0].toLowerCase() });
      index += match[0].length;
      continue;
    }

    if ("+-*/%^!".includes(char)) {
      tokens.push({ type: "operator", value: char });
      index += 1;
      continue;
    }

    if (char === "(" || char === ")") {
      tokens.push({ type: "paren", value: char });
      index += 1;
      continue;
    }

    throw new Error(`Unsupported character: ${char}`);
  }

  return tokens;
}

function factorial(value: number) {
  if (value < 0 || Math.abs(value - Math.round(value)) > EPSILON) {
    throw new Error("Factorial only works for non-negative integers.");
  }

  let result = 1;
  for (let current = 2; current <= Math.round(value); current += 1) {
    result *= current;
  }
  return result;
}

class Parser {
  private readonly tokens: Token[];
  private readonly angleMode: AngleMode;
  private index = 0;

  constructor(tokens: Token[], angleMode: AngleMode) {
    this.tokens = tokens;
    this.angleMode = angleMode;
  }

  parse() {
    const result = this.parseExpression();
    if (this.peek()) {
      throw new Error("Unexpected token at the end of the expression.");
    }
    return result;
  }

  private peek() {
    return this.tokens[this.index];
  }

  private consume() {
    const token = this.tokens[this.index];
    this.index += 1;
    return token;
  }

  private matchOperator(...operators: string[]) {
    const token = this.peek();
    if (token?.type === "operator" && operators.includes(token.value)) {
      this.consume();
      return token.value;
    }
    return null;
  }

  private parseExpression(): number {
    let value = this.parseTerm();

    while (true) {
      const operator = this.matchOperator("+", "-");
      if (!operator) {
        return value;
      }

      const right = this.parseTerm();
      value = operator === "+" ? value + right : value - right;
    }
  }

  private parseTerm(): number {
    let value = this.parsePower();

    while (true) {
      const operator = this.matchOperator("*", "/", "%");
      if (!operator) {
        return value;
      }

      const right = this.parsePower();
      if ((operator === "/" || operator === "%") && Math.abs(right) < EPSILON) {
        throw new Error("Division by zero is not allowed.");
      }

      if (operator === "*") {
        value *= right;
      } else if (operator === "/") {
        value /= right;
      } else {
        value %= right;
      }
    }
  }

  private parsePower(): number {
    const left = this.parseUnary();
    if (this.matchOperator("^")) {
      return Math.pow(left, this.parsePower());
    }
    return left;
  }

  private parseUnary(): number {
    const operator = this.matchOperator("+", "-");
    if (operator) {
      const value = this.parseUnary();
      return operator === "-" ? -value : value;
    }
    return this.parsePostfix();
  }

  private parsePostfix(): number {
    let value = this.parsePrimary();
    while (this.matchOperator("!")) {
      value = factorial(value);
    }
    return value;
  }

  private parsePrimary(): number {
    const token = this.peek();

    if (!token) {
      throw new Error("Expression is incomplete.");
    }

    if (token.type === "number") {
      this.consume();
      return token.value;
    }

    if (token.type === "paren" && token.value === "(") {
      this.consume();
      const value = this.parseExpression();
      const closing = this.consume();
      if (!closing || closing.type !== "paren" || closing.value !== ")") {
        throw new Error("Missing closing parenthesis.");
      }
      return value;
    }

    if (token.type === "identifier") {
      this.consume();

      if (token.value === "pi") {
        return Math.PI;
      }
      if (token.value === "e") {
        return Math.E;
      }

      const opening = this.consume();
      if (!opening || opening.type !== "paren" || opening.value !== "(") {
        throw new Error(`Function ${token.value} must be followed by parentheses.`);
      }

      const argument = this.parseExpression();
      const closing = this.consume();
      if (!closing || closing.type !== "paren" || closing.value !== ")") {
        throw new Error("Missing closing parenthesis.");
      }

      return this.applyFunction(token.value, argument);
    }

    throw new Error("Unable to parse the expression.");
  }

  private applyFunction(name: string, value: number) {
    const input =
      ["sin", "cos", "tan"].includes(name) && this.angleMode === "deg"
        ? (value * Math.PI) / 180
        : value;

    switch (name) {
      case "sin":
        return Math.sin(input);
      case "cos":
        return Math.cos(input);
      case "tan":
        return Math.tan(input);
      case "asin":
        return this.angleMode === "deg"
          ? (Math.asin(value) * 180) / Math.PI
          : Math.asin(value);
      case "acos":
        return this.angleMode === "deg"
          ? (Math.acos(value) * 180) / Math.PI
          : Math.acos(value);
      case "atan":
        return this.angleMode === "deg"
          ? (Math.atan(value) * 180) / Math.PI
          : Math.atan(value);
      case "sqrt":
        if (value < 0) {
          throw new Error("Square root of a negative number is not supported here.");
        }
        return Math.sqrt(value);
      case "ln":
        if (value <= 0) {
          throw new Error("ln only works for positive values.");
        }
        return Math.log(value);
      case "log":
        if (value <= 0) {
          throw new Error("log only works for positive values.");
        }
        return Math.log10(value);
      case "abs":
        return Math.abs(value);
      default:
        throw new Error(`Unsupported function: ${name}`);
    }
  }
}

export function evaluateScientificExpression(expression: string, angleMode: AngleMode) {
  const trimmed = expression.trim();
  if (!trimmed) {
    throw new Error("Enter an expression to evaluate.");
  }

  const parser = new Parser(tokenize(trimmed), angleMode);
  return parser.parse();
}
