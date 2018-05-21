export declare type KeyMapReducer = {
    [key: string]: Reducer;
};
export declare type Action = any;
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
export interface DoraStaticConfig {
    store: ReduxStore;
    combineReducers: CombineReducers;
}
export interface DoraConfig {
    key: string;
}
