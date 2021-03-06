import { AppState } from '../rootReducer';
import { Measurement } from '../../types';

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
  return requestedValue ?? actualValue;
};

export const selectDraftMeasurementValueToDisplay = (measurement: Measurement) => (
  state: AppState,
) => {
  const { draftValue, editMode } = state.measurements.measurements[measurement];
  return editMode ? draftValue : null;
};

export const selectResetMeasurementsState = (state: AppState) => state.measurements.resetState;

export const selectResetMeasurementsInProgress = (state: AppState) =>
  state.measurements.resetInProgress;
export const selectResetMeasurementsError = (state: AppState) => state.measurements.resetError;
