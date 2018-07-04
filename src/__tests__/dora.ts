import Dora from '../dora';

const store = {
  dispatch: (action: any) => {},
  getState: () => {},
  replaceReducer: (reducer: any) => {},
  subscribe: () => {},
  keyMapReducer: {},
  runSaga: (saga: any) => ({})
};

function combineReducers (reducers: any) {
  return reducers;
}

it('define api before Dora.init', function () {

  const httpClient = {
    get: () => Promise.resolve(),
    post: () => Promise.resolve(),
    put: () => Promise.resolve(),
    delete: () => Promise.resolve()
  };

  const api = Dora.api(http => {
    return () => Promise.resolve(http);
  });

  Dora.init({store, combineReducers, httpClient});

  return api().then(http => {
    expect(http).toBe(httpClient);
  });
});

it('runSaga after initialized', function () {

});
