import { combineReducers } from 'redux';
import { connectionReducer } from './connection/reducer';
import * as ConnectionActions from './connection/actions';
import { measurementsReducer } from './measurements/reducer';
import * as MeasurementsActions from './measurements/actions';
import { ActionType, StateType } from 'typesafe-actions';

export const buildRootReducer = () =>
  combineReducers({ connection: connectionReducer, measurements: measurementsReducer });
export type AppState = StateType<ReturnType<typeof buildRootReducer>>;
export const RootActions = {
  ConnectionActions,
  MeasurementsActions,
};
export type AppActions = ActionType<typeof RootActions>;
