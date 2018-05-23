export type KeyMapReducer = {[key: string]: Reducer};
export type Action = any;

export interface Reducer {
  (state: any, action: Action): any;
}
export interface Saga {

}
export interface SagaTask {

}
export interface ReduxStore {
  keyMapReducer: KeyMapReducer;
  getState: () => any;
  dispatch: (action: Action) => any;
  replaceReducer: (reducer: Reducer) => any;
  runSaga?: (saga: Saga, ...args: any[]) => SagaTask;
}

export interface CombineReducers {
  (keyMapReducer: KeyMapReducer): Reducer;
}

export interface HttpClient {
  get: (...args: any[]) => Promise<any>;
  post: (...args: any[]) => Promise<any>;
  put: (...args: any[]) => Promise<any>;
  delete: (...args: any[]) => Promise<any>;
}

export interface DoraStaticConfig {
  store: ReduxStore;
  combineReducers: CombineReducers;
  httpClient?: HttpClient;
}

export interface DoraConfig {
  key: string;
}
