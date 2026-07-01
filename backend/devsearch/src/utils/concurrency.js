// Runs `fn` over `items` with at most `limit` in flight at once.
// Keeps things fast (parallel) without opening 50 GitHub requests at once
// and tripping rate limits or serverless function timeouts.
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const current = nextIndex++;
      results[current] = await fn(items[current], current);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(workers);

  return results;
}

module.exports = { mapLimit };