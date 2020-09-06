import * as actions from './actions';
import { Measurement } from '../../types';
import { MeasurementsReducer, MeasurementState } from './types';
import { ActionType, getType } from 'typesafe-actions';
import {
  saveMeasurementAction,
  setMeasurementEditModeAction,
  updateMeasurementsAction,
  updateMeasurementDraftValueAction,
  resetMeasurementsClickAction,
  resetMeasurementsClickTimeoutAction,
  resetMeasurementsAction,
} from './actions';
import { getKeys } from '../../utils';

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
  resetClicks: 0,
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
        resetClicks: state.resetClicks + 1,
        resetError: null,
      };
    case getType(resetMeasurementsClickTimeoutAction):
      return {
        ...state,
        resetClicks: 0,
      };
    case getType(resetMeasurementsAction.request):
      return {
        ...state,
        resetClicks: 0,
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
