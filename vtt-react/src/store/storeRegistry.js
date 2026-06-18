const registry = {};

export function registerStore(key, store) {
  registry[key] = store;
}

export function getStore(key) {
  return registry[key];
}
