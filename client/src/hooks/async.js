export function createAsyncState(initialData = null) {
  let state = {
    status: "idle", // "idle" | "loading" | "success" | "error"
    data: initialData,
    error: null,
  };

  const listeners = new Set();
  const notify = () => listeners.forEach((fn) => fn(state));

  function set(partial) {
    state = { ...state, ...partial };
    notify();
  }

  function get() {
    return state;
  }

  function subscribe(fn) {
    listeners.add(fn);
    // immediately emit current state
    fn(state);
    return () => listeners.delete(fn);
  }

  return { get, set, subscribe };
}

/**
 * useAsyncAction-like helper:
 * Wrap an async function and manage loading/success/error state.
 */
export function createAsyncAction(asyncFn, { initialData = null } = {}) {
  const store = createAsyncState(initialData);
  let runId = 0; // prevents race conditions

  async function run(...args) {
    const currentId = ++runId;
    store.set({ status: "loading", error: null });

    try {
      const result = await asyncFn(...args);
      if (currentId !== runId) return result; // ignore stale results
      store.set({ status: "success", data: result, error: null });
      return result;
    } catch (err) {
      if (currentId !== runId) throw err;
      store.set({ status: "error", error: err });
      // throw err;
    }
  }

  function reset(data = initialData) {
    runId++;
    store.set({ status: "idle", data, error: null });
  }

  return { run, reset, ...store };
}

/**
 * useAsync-like helper:
 * Automatically runs an async function once and stores state.
 */
export function createAsync(
  asyncFn,
  { initialData = null, immediate = true } = {}
) {
  const action = createAsyncAction(asyncFn, { initialData });

  if (immediate) {
    // fire and forget; UI updates via subscription
    action.run().catch(() => {});
  }

  return action;
}
