# ct0r/promise-queue

Minimalistic promise queue.

## Installation

```bash
npm install @ct0r/promise-queue
```

## Usage

```js
const queue = require("@ct0r/promise-queue");

const enqueue = queue({ concurrency: 2 });

Promise.all([
  enqueue(() => fetch("https://example.com/1")),
  enqueue(() => fetch("https://example.com/2")),
]);
```

Arguments can be passed separately:

```js
Promise.all([
  enqueue(fetch, "https://example.com/1"),
  enqueue(fetch, "https://example.com/2"),
]);
```

Can be used to add concurrency support to existing async function:

```js
const enqueueFetch = queue({ fn: fetch });

Promise.all([
  enqueueFetch("https://example.com/1"),
  enqueueFetch("https://example.com/2"),
]);
```

Perfect in combination with iterables:

```js
Promise.all(
  ["https://example.com/1", "https://example.com/2"].map(enqueueFetch)
);
```

## API

#### `queue({ concurrency = 1, fn })`

Sets concurrency level and returns `enqueue` function.

#### `enqueue(...args)`

Returned by `queue` if `fn` is provided.

#### `enqueue(fn, ...args)`

Returned by `queue` if `fn` is not provided.
