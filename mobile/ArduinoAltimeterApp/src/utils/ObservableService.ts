import { from, Observable, ObservableInput } from 'rxjs';

type Service = object;

type ObservableValue<T> = T extends ObservableInput<infer V> ? Observable<V> : T;
type ObservableProperty<TProperty> = TProperty extends (...args: infer A) => infer R
  ? (...args: A) => ObservableValue<R>
  : ObservableValue<TProperty>;

export type ObservableService<T extends Service> = {
  [P in keyof T]: ObservableProperty<T[P]>;
};

const isPromise = (value: unknown): value is Promise<unknown> => {
  return value instanceof Promise;
};

const wrapValue = <T>(value: T): T extends ObservableInput<infer V> ? Observable<V> : T => {
  if (isPromise(value)) {
    return from(value) as T extends ObservableInput<infer V> ? Observable<V> : never;
  }
  return value as T extends ObservableInput<infer V> ? never : T;
};

const wrapProperty = <TService extends Service, TKey extends keyof TService>(
  service: TService,
  key: TKey,
) => {
  const property = service[key];
  if (typeof property === 'function') {
    return function proxy(this: TService, ...args: unknown[]) {
      const value = property.call(this, ...args);
      return wrapValue(value);
    };
  }
  return wrapValue(property);
};

export const toObservable = <TService extends Service>(
  service: TService,
): ObservableService<TService> => {
  return new Proxy(service, {
    get: (target, key: keyof TService) => wrapProperty(target, key),
  }) as ObservableService<TService>;
};
