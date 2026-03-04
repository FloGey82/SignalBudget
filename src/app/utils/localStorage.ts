export function saveToLocalStorage<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  const json = localStorage.getItem(key);

  if (!json) return defaultValue;

  try {
    return JSON.parse(json) as T;
  } catch {
    return defaultValue;
  }
}
