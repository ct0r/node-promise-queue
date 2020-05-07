function queue({ concurrency = 1 } = {}) {
  const fns = [];
  let pendings = 0;

  const next = () => {
    if (pendings >= concurrency || !fns.length) return;

    const { fn, args, resolve, reject } = fns.shift();

    pendings++;

    invoke(fn, args)
      .then((val) => {
        pendings--;
        resolve(val);
        next();
      })
      .catch((err) => {
        pendings--;
        reject(err);
        next();
      });
  };

  return (fn, ...args) =>
    new Promise((resolve, reject) => {
      fns.push({ fn, args, resolve, reject });
      next();
    });
}

function invoke(fn, args) {
  try {
    return fn(...args);
  } catch (err) {
    return Promise.reject(err);
  }
}

module.exports = queue;
