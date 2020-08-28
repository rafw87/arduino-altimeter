import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { AppActions, AppState, buildRootReducer } from './rootReducer';
import { connectionReducerInitialState } from './connection/reducer';
import { measurementsReducerInitialState } from './measurements/reducer';
import { createMeasurementsMiddleware } from './measurements/middleware';
import { buildEpicMiddleware } from './rootEpic';
import { Services } from './types';
import { createConnectionMiddleware } from './connection/middleware';

export type GlobalStore = Store<AppState, AppActions>;

export function createAppStore(services: Services): GlobalStore {
  const { bluetoothService } = services;
  const initialState = {
    connection: connectionReducerInitialState,
    measurements: measurementsReducerInitialState,
  } as AppState;

  const composeEnhancers = composeWithDevTools({});

  const rootReducer = buildRootReducer();
  const { epicMiddleware, rootEpic } = buildEpicMiddleware(services);
  const measurementsMiddleware = createMeasurementsMiddleware({ bluetoothService });
  const connectionMiddleware = createConnectionMiddleware({ bluetoothService });

  const store = createStore<AppState, AppActions, {}, {}>(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(epicMiddleware, connectionMiddleware, measurementsMiddleware)),
  );
  epicMiddleware.run(rootEpic);
  return store;
}
