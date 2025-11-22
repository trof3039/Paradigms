'use strict';

const reader = ({ id }) => ({ id, name: 'marcus', age: 42 });

const execute = (plan) => (reader, log, env = {}) => {
  if (plan.read) {
    const user = reader(plan.read);
    return execute(plan.then)(reader, log, { user });
  }
  if (plan.match) {
    const ok = env.user.name === plan.match.name;
    return execute(ok ? plan.success : plan.fail)(reader, log, env);
  }
  if (plan.effect) {
    if (plan.effect.log) return () => log(env.user[plan.effect.log]);
    if (plan.effect === 'noop') return () => {};
  }
};

execute({
  read: { id: 15 },
  then: {
    match: { name: 'marcus' },
    success: { effect: { log: 'age' } },
    fail: { effect: 'noop' },
  },
})(reader, console.log)();

// 1. Rewrite in OOP style
// 2. Improve data structure inconsistence

class Exec {
  #options = null
  #data = null

  constructor(options) {
    this.#options = options
  }

  #match(value) {
    return Object.keys(value).reduce(
      (acc, key) => acc && value[key] === this.#data[key]
      , true
    )
  }

  #read(value) {
    try {
      this.#data = this.#options.reader(value)
      return true
    } catch (error) {
      return false
    }
  }

  #log(key) {
    this.#options.log(this.#data[key])
  }

  run(steps) {
    for (const step of steps) {
      let result = undefined
      if (step.type === 'read') result = this.#read(step.value)
      if (step.type === 'match') result = this.#match(step.value)

      if (result === undefined) throw new Error(`invalid step type ${step.type}`)

      const action = result ? step.success : step.fail
      if (action === null) continue
      if (action.log) this.#log(action.log)
      if (action.break) break
    }
  }
}

const steps = [
  {
    type: 'read',
    value: { id: 15 },
    success: null,
    fail: { break: true }
  },
  {
    type: 'match',
    value: { name: 'marcus' },
    success: { log: 'age' },
    fail: null
  },
]

const options = {
  reader,
  log: console.log
}

const main = new Exec(options);
main.run(steps);
