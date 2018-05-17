import { getAsyncType } from './utils';

export function bind (target, key, descriptor) {
  descriptor.value.$bind = true;
  return descriptor;
}

export function rootReducer (target, key, descriptor) {
  descriptor.value.$bind = true;
  descriptor.value.$rootReducer = true;
  return descriptor;
}

export function reducer (target, key, descriptor) {
  descriptor.value.$bind = true;
  descriptor.value.$reducer = true;
  return descriptor;
}

export function saga (target, key, descriptor) {
  descriptor.value.$bind = true;
  descriptor.value.$saga = true;
  return descriptor;
}

export function typeDef (target, key) {
  if (typeof target === 'function') {
    // static type
    const namespace = target.name;
    target[key] = `${namespace}/${key}`;
    // console.warn('typeDef is not compatible with static field.');
    return target;
  } else {
    // instance type
    return {
      get () {
        const cacheKey = '__' + key;
        if (!this[cacheKey]) {
          const namespace = this.constructor.name;
          this[cacheKey] = `${namespace}<${this.key}>/${key}`;
        }
        return this[cacheKey];
      }
    };
  }
}

export function asyncTypeDef (target, key) {
  if (typeof target === 'function') {
    const namespace = target.name;
    target[key] = getAsyncType(key, namespace);
    // console.warn('asyncTypeDef is not compatible with static field.');
    return target;
  } else {
    return {
      get () {
        const cacheKey = '__' + key;
        if (!this[cacheKey]) {
          const namespace = this.constructor.name;
          this[cacheKey] = getAsyncType(key, namespace, this.key);
        }
        return this[cacheKey];
      }
    };
  }
}

