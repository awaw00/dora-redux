import { getAsyncType } from './utils';

export function bind (target: any, key: any, descriptor: any) {
  descriptor.value.$bind = true;
  return descriptor;
}

export function rootReducer (target: any, key: any, descriptor: any) {
  descriptor.value.$bind = true;
  descriptor.value.$rootReducer = true;
  return descriptor;
}

export function reducer (target: any, key: any, descriptor: any) {
  descriptor.value.$bind = true;
  descriptor.value.$reducer = true;
  return descriptor;
}

export function saga (target: any, key: any, descriptor: any) {
  descriptor.value.$bind = true;
  descriptor.value.$saga = true;
  return descriptor;
}

export function typeDef (target: any, key: any) {
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
          this[cacheKey] = `${namespace}<${this['key']}>/${key}`;
        }
        return this[cacheKey];
      }
    };
  }
}

export function asyncTypeDef (target: any, key: any) {
  if (typeof target === 'function') {
    const namespace = target.name;
    target[key] = getAsyncType(key, namespace);
    return target;
  } else {
    return {
      get () {
        const cacheKey = '__' + key;
        if (!this[cacheKey]) {
          const namespace = this.constructor.name;
          this[cacheKey] = getAsyncType(key, namespace, this['key']);
        }
        return this[cacheKey];
      }
    };
  }
}

