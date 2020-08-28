import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { AppActions, AppState, buildRootReducer } from './rootReducer';
import { measurementsReducerInitialState } from './measurements/reducer';
import { createMeasurementsMiddleware } from './measurements/middleware';
import { buildEpicMiddleware } from './rootEpic';
import { Services } from './types';

export type GlobalStore = Store<AppState, AppActions>;

export function createAppStore(services: Services): GlobalStore {
  const { bluetoothService } = services;
  const initialState = {
    measurements: measurementsReducerInitialState,
  } as AppState;

  const composeEnhancers = composeWithDevTools({});

  const rootReducer = buildRootReducer();
  const { epicMiddleware, rootEpic } = buildEpicMiddleware(services);
  const measurementsMiddleware = createMeasurementsMiddleware({ bluetoothService });

  const store = createStore<AppState, AppActions, {}, {}>(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(epicMiddleware, measurementsMiddleware)),
  );
  epicMiddleware.run(rootEpic);
  return store;
}
