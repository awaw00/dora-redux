import { bind } from './decorators';
import { getClassMembersDescriptor } from './utils';

import {
  ReduxStore,
  DoraStaticConfig,
  Reducer,
  CombineReducers,
  Action,
  DoraConfig,
  HttpClient
} from './types';

export default class Dora {
  static initialized = false;
  static store: ReduxStore = null;
  static combineReducers: CombineReducers = null;
  static _httpClient: HttpClient = null;
  static get httpClient () {
    return Dora._httpClient;
  }

  static replaceReducers () {
    const store = Dora.store;
    store.replaceReducer(Dora.combineReducers({
      ...store.keyMapReducer
    }));
  }

  static init (doraConfig: DoraStaticConfig) {
    Dora.store = doraConfig.store;
    Dora.combineReducers = doraConfig.combineReducers;
    Dora.initialized = true;
    if (doraConfig.httpClient) {
      Dora._httpClient = doraConfig.httpClient;
    }
  }

  static reset () {
    Dora.store = null;
    Dora.combineReducers = null;
    Dora.initialized = false;
  }

  static api<T = any> (makeApiCallFn: (http: HttpClient) => (...apiArgs: any[]) => Promise<T>) {
    return function (...apiArgs: any[]) {
      return makeApiCallFn(Dora.httpClient).apply(null, apiArgs) as Promise<T>;
    };
  }

  key = '';
  config: DoraConfig;
  rootReducer: Reducer;

  _store: ReduxStore = null;

  get reducerKey () {
    return this.constructor.name + '_' + this.key;
  }

  get store () {
    return this._store || Dora.store;
  }

  set store (store) {
    this._store = store;
  }

  constructor (config: DoraConfig) {
    if (!config || typeof config.key !== 'string' || config.key.length === 0) {
      throw new Error('invalid config, config.key should be string with length larger than 0');
    }
    this.config = config;
    this.key = config.key;
    this.processDecoratedMethods();

    if (this.rootReducer) {
      this.loadReducer();
    }

    this.loadReducer = this.loadReducer.bind(this);
    this.unloadReducer = this.unloadReducer.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.getState = this.getState.bind(this);
  }

  loadReducer () {
    if (!this.rootReducer) {
      throw new Error('no reducer');
    }
    const store = this.store;
    store.keyMapReducer = store.keyMapReducer || {};
    store.keyMapReducer[this.reducerKey] = this.rootReducer;
    Dora.replaceReducers();
  }

  unloadReducer () {
    delete this.store.keyMapReducer[this.reducerKey];
    Dora.replaceReducers();
  }

  getState (keyPath: string | (string | number)[], defaultValue: any) {
    const stateTree = this.store.getState();
    let state;
    if (typeof stateTree.get === 'function') {
      state = stateTree.get(this.reducerKey);
    } else {
      state = stateTree[this.reducerKey];
    }

    if (keyPath !== void 0) {
      if (!Array.isArray(keyPath)) {
        keyPath = [keyPath];
      }

      if (typeof state.getIn === 'function') {
        state = state.getIn(keyPath, defaultValue);
      } else {
        for (const key of keyPath) {
          state = state[key];
          if (state === void 0) {
            state = defaultValue;
            break;
          }
        }
      }
    }
    return state;
  }

  dispatch (action: Action) {
    return this.store.dispatch(action);
  }

  processDecoratedMethods () {
    let prototype = Object.getPrototypeOf(this);
    const membersDescriptor = getClassMembersDescriptor(prototype);

    let nameMapReducer = {};
    let rootReducer: Reducer;
    const sagaEntries: any[] = [];
    membersDescriptor.forEach(i => {
      const {name, descriptor} = i;
      if (!descriptor || typeof descriptor.value !== 'function') {
        return;
      }
      const func = this[name];
      const {$bind, $reducer, $rootReducer, $saga} = func;

      if ($bind) {
        this[name] = this[name].bind(this);
      }

      if ($reducer) {
        nameMapReducer[name] = this[name];
      }

      if ($rootReducer) {
        if (rootReducer) {
          throw new Error('rootReducer more than one');
        }
        rootReducer = this[name];
      }

      if ($saga) {
        sagaEntries.push(this[name]);
      }
    });

    const subReducerCount = Object.keys(nameMapReducer).length;

    if (subReducerCount > 0 && rootReducer) {
      throw new Error('reducer and rootReducer cannot use together');
    }

    if (rootReducer) {
      this.rootReducer = rootReducer;
    } else {
      if (subReducerCount > 0) {
        this.rootReducer = Dora.combineReducers(nameMapReducer);
      }
    }

    if (sagaEntries.length > 0) {
      if (typeof this.store.runSaga !== 'function') {
        throw new Error('store.runSaga is not a function');
      }

      sagaEntries.forEach(i => this.store.runSaga(i));
    }
  }
}
