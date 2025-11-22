'use strict';

// Rewrite to TypeScript with interface

interface ISerializable {
  toJson(): string 
}

class User implements ISerializable {
  #id: number;
  #name: string;

  constructor(id: number, name: string) {
    this.#id = id;
    this.#name = name;
  }

  toJson(): string {
    return JSON.stringify({ id: this.#id, name: this.#name })
  }
}

const user = new User(15, 'Marcus');
console.log(user.toString());
console.log(user.toJson());
