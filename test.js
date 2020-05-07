const test = require("ava");
const sinon = require("sinon");
const queue = require(".");

const promiseWrap = () => {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};

test("enqueue calls given function with given parameters", async (t) => {
  const arg1 = 1;
  const arg2 = 2;
  const fnSpy = sinon.spy(() => Promise.resolve());

  const enqueue = queue();
  await enqueue(fnSpy, arg1, arg2);

  t.true(fnSpy.calledOnceWith(arg1, arg2));
});

test("enqueue respects given concurrency level", async (t) => {
  const wraps = [promiseWrap(), promiseWrap(), promiseWrap()];
  const spies = wraps.map((item) => sinon.spy(() => item.promise));

  const enqueue = queue({ concurrency: 2 });
  const [promise1, promise2, promise3] = spies.map(enqueue);

  const [spy1, spy2, spy3] = spies;
  const [wrap1, wrap2, wrap3] = wraps;

  t.true(spy1.calledOnce);
  t.true(spy2.calledOnce);
  t.true(spy3.notCalled);

  wrap1.resolve(1);
  const result1 = await promise1;
  t.is(result1, 1);
  t.true(spy3.calledOnce);

  wrap2.resolve(2);
  const result2 = await promise2;
  t.is(result2, 2);

  const error = new Error();
  wrap3.reject(error);
  const err = await t.throwsAsync(() => promise3);
  t.is(err, error);
});

test("enqueue returns rejected promise on sync error", async (t) => {
  const enqueue = queue();
  const error = new Error();

  const err = await t.throwsAsync(() =>
    enqueue(() => {
      throw error;
    })
  );

  t.is(err, error);
});
