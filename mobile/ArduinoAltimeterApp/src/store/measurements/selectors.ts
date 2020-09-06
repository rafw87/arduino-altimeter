import { AppState } from '../rootReducer';
import { Measurement } from '../../types';
import { RESET_CLICK_COUNT } from './constants';

export const selectDraftValue = (measurement: Measurement) => (state: AppState) =>
  state.measurements.measurements[measurement].draftValue;

export const selectRequestedValue = (measurement: Measurement) => (state: AppState) =>
  state.measurements.measurements[measurement].requestedValue;

export const selectActualValue = (measurement: Measurement) => (state: AppState) =>
  state.measurements.measurements[measurement].actualValue;

export const selectEditMode = (measurement: Measurement) => (state: AppState) =>
  state.measurements.measurements[measurement].editMode;

export const selectSaveInProgress = (measurement: Measurement) => (state: AppState) =>
  state.measurements.measurements[measurement].saveInProgress;

export const selectSaveError = (measurement: Measurement) => (state: AppState) =>
  state.measurements.measurements[measurement].error;

export const selectMeasurementValueToDisplay = (measurement: Measurement) => (state: AppState) => {
  const { draftValue, requestedValue, actualValue, editMode } = state.measurements.measurements[
    measurement
  ];
  return editMode ? draftValue : requestedValue ?? actualValue;
};

export const selectResetMeasurementsClicks = (state: AppState) => state.measurements.resetClicks;
export const selectResetMeasurementsRemainedClicks = (state: AppState) =>
  RESET_CLICK_COUNT - state.measurements.resetClicks;
export const selectResetMeasurementsInProgress = (state: AppState) =>
  state.measurements.resetInProgress;
export const selectResetMeasurementsError = (state: AppState) => state.measurements.resetError;
