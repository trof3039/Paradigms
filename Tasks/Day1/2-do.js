'use strict';


function Do (data) {
  const fns = []

  const doer = {
    bind: (fn) => {
      if (typeof fn !== 'function') throw new Error('fn should be a function');
      fns.push(fn);
      return doer
    },

    run: () => fns.length ? fns.reduce((acc, fn) => fn(acc), data) : undefined
  }

  return doer
}

function Do2 (data, fns = []) {
  return {
    bind: (fn) => {
      if (typeof fn !== 'function') throw new Error('fn should be a function');
      return new Do2(data, [...fns, fn])
    },

    run: () => fns.length ? fns.reduce((acc, fn) => fn(acc), data) : undefined
  }
}

// Put implementation here in class syntax

Do({ id: 15 })
  .bind(({ id }) => ({ id, name: 'marcus', age: 42 }))
  .bind(({ name, age }) => (name === 'marcus' ? (log) => log(age) : () => {}))
  .run()(console.log);
