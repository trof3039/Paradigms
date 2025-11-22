class Integer {
  #value: number

  constructor(value: number) {
    if (!Number.isInteger(value)) throw new Error('Value is not an interger'); 
    this.#value = value
  }

  get(): number {
    return this.#value
  }

  add(int: Integer): Integer {
    return new Integer(this.#value + int.#value)
  }

  div(int: Integer): Integer {
    if (int.#value === 0) throw new Error('Cannot divide by zero')
    return new Integer(Math.floor(this.#value / int.#value))
  }

  gt(int: Integer): boolean {
    return this.#value > int.#value
  }
}

// Usage

const a = new Integer(7);
const b = new Integer(3);

const c = a.add(b);
const d = a.div(b);
if (a.gt(b)) {
  console.log('a > b');
}

console.log(`c = ${c.get()}`);
console.log(`d = ${d.get()}`);
