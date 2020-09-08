import { ActionType, getType } from 'typesafe-actions';
import { getKeys } from '../../utils';
import { Measurement } from '../../types';
import * as actions from './actions';
import {
  resetMeasurementsAction,
  resetMeasurementsClickAction,
  resetMeasurementsConfirmAction,
  resetMeasurementsResetAction,
  saveMeasurementAction,
  setMeasurementEditModeAction,
  updateMeasurementDraftValueAction,
  updateMeasurementsAction,
} from './actions';
import { MeasurementsReducer, MeasurementState, ResetState } from './types';

const measurementInitialState: MeasurementState = {
  draftValue: null,
  requestedValue: null,
  actualValue: 1,
  saveInProgress: false,
  error: null,
  editMode: false,
};

export const measurementsReducerInitialState: MeasurementsReducer = {
  measurements: {
    temperature: { ...measurementInitialState },
    humidity: { ...measurementInitialState },
    pressure: { ...measurementInitialState },
    seaLevelPressure: { ...measurementInitialState },
    altitude: { ...measurementInitialState },
    minAlt: { ...measurementInitialState },
    maxAlt: { ...measurementInitialState },
    avgAlt: { ...measurementInitialState },
    ascend: { ...measurementInitialState },
    descend: { ...measurementInitialState },
  },
  resetState: ResetState.Ready,
  resetInProgress: false,
  resetError: null,
};

const updateMeasurement = (
  state: MeasurementsReducer,
  measurement: Measurement,
  update: (current: MeasurementState) => MeasurementState,
) => {
  return {
    ...state,
    measurements: {
      ...state.measurements,
      [measurement]: update(state.measurements[measurement]),
    },
  };
};

export const measurementsReducer = (
  state: MeasurementsReducer = measurementsReducerInitialState,
  action: ActionType<typeof actions>,
): MeasurementsReducer => {
  switch (action.type) {
    case getType(updateMeasurementsAction):
      return getKeys(action.payload).reduce((state, measurement) => {
        const value = action.payload[measurement] as number;
        return updateMeasurement(state, measurement, (current) => ({
          ...current,
          actualValue: value,
          requestedValue: current.saveInProgress ? current.requestedValue : null,
        }));
      }, state);
    case getType(setMeasurementEditModeAction):
      return updateMeasurement(state, action.payload.measurement, (current) => ({
        ...current,
        editMode: action.payload.editMode,
        draftValue: action.payload.editMode
          ? current.requestedValue ?? current.actualValue
          : current.draftValue,
      }));
    case getType(updateMeasurementDraftValueAction):
      return updateMeasurement(state, action.payload.measurement, (current) => ({
        ...current,
        draftValue: action.payload.value,
      }));
    case getType(saveMeasurementAction.request):
      return updateMeasurement(state, action.payload.measurement, (current) => ({
        ...current,
        draftValue: null,
        requestedValue: action.payload.value,
        saveInProgress: true,
        error: null,
      }));
    case getType(saveMeasurementAction.success):
      return updateMeasurement(state, action.payload.measurement, (current) => ({
        ...current,
        saveInProgress: false,
        error: null,
      }));
    case getType(saveMeasurementAction.failure):
      return updateMeasurement(state, action.payload.measurement, (current) => ({
        ...current,
        saveInProgress: false,
        error: action.payload.error,
      }));
    case getType(resetMeasurementsClickAction):
      return {
        ...state,
        resetState: ResetState.WaitingForConfirmation,
      };
    case getType(resetMeasurementsConfirmAction):
      return {
        ...state,
        resetState: ResetState.StatusNotification,
      };
    case getType(resetMeasurementsResetAction):
      return {
        ...state,
        resetState: ResetState.Ready,
      };
    case getType(resetMeasurementsAction.request):
      return {
        ...state,
        resetError: null,
        resetInProgress: true,
      };
    case getType(resetMeasurementsAction.success):
      return {
        ...state,
        resetError: null,
        resetInProgress: false,
      };
    case getType(resetMeasurementsAction.failure):
      return {
        ...state,
        resetError: action.payload,
        resetInProgress: false,
      };
    default:
      return state;
  }
};
