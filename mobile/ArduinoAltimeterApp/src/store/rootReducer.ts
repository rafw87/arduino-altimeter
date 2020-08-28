import { combineReducers } from 'redux';
import { measurementsReducer } from './measurements/reducer';
import * as MeasurementsActions from './measurements/actions';
import { ActionType, StateType } from 'typesafe-actions';

export const buildRootReducer = () => combineReducers({ measurements: measurementsReducer });
export type AppState = StateType<ReturnType<typeof buildRootReducer>>;
export const RootActions = {
  MeasurementsActions,
};
export type AppActions = ActionType<typeof RootActions>;
