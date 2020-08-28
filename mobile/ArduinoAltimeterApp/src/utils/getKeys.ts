export const getKeys = <TKey extends string>(obj: { [key in TKey]?: unknown }): TKey[] =>
  Object.keys(obj) as TKey[];
