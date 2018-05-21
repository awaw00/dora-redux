import { ReduxStore, DoraStaticConfig, Reducer, CombineReducers, Action, DoraConfig } from './types';
export default class Dora {
    static initialized: boolean;
    static store: ReduxStore;
    static combineReducers: CombineReducers;
    static replaceReducers(): void;
    static init(doraConfig: DoraStaticConfig): void;
    static reset(): void;
    key: string;
    config: DoraConfig;
    rootReducer: Reducer;
    _store: ReduxStore;
    readonly reducerKey: string;
    store: ReduxStore;
    constructor(config: DoraConfig);
    loadReducer(): void;
    unloadReducer(): void;
    getState(keyPath: string | (string | number)[], defaultValue: any): any;
    dispatch(action: Action): any;
    processDecoratedMethods(): void;
}
