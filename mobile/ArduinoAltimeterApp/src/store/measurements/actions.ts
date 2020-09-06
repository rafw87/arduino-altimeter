import { createAction, createAsyncAction } from 'typesafe-actions';
import { Measurement } from '../../types';
import { MeasurementValues } from './types';

type UpdateMeasurementDraftValuePayload = {
  measurement: Measurement;
  value: string | null;
};
export const updateMeasurementDraftValueAction = createAction(
  '@MEASUREMENTS/UPDATE_MEASUREMENT_DRAFT_VALUE',
)<UpdateMeasurementDraftValuePayload>();

type UpdateMeasurementsPayload = MeasurementValues;
export const updateMeasurementsAction = createAction('@MEASUREMENTS/UPDATE_MEASUREMENTS')<
  UpdateMeasurementsPayload
>();

type SetMeasurementEditModePayload = {
  measurement: Measurement;
  editMode: boolean;
  draftValue: string | null;
};
export const setMeasurementEditModeAction = createAction('@MEASUREMENTS/SET_MEASUREMENT_EDIT_MODE')<
  SetMeasurementEditModePayload
>();

type SaveMeasurementRequestPayload = {
  measurement: Measurement;
  value: number;
};
type SaveMeasurementSuccessPayload = {
  measurement: Measurement;
  value: number;
};
type SaveMeasurementFailurePayload = {
  measurement: Measurement;
  error: Error;
};
export const saveMeasurementAction = createAsyncAction(
  '@MEASUREMENTS/SAVE_MEASUREMENT_REQUEST',
  '@MEASUREMENTS/SAVE_MEASUREMENT_SUCCESS',
  '@MEASUREMENTS/SAVE_MEASUREMENT_FAILURE',
)<SaveMeasurementRequestPayload, SaveMeasurementSuccessPayload, SaveMeasurementFailurePayload>();

export const resetMeasurementsClickAction = createAction('@MEASUREMENTS/RESET_MEASUREMENTS_CLICK')<
  undefined
>();

export const resetMeasurementsConfirmAction = createAction(
  '@MEASUREMENTS/RESET_MEASUREMENTS_CONFIRM',
)<undefined>();

export const resetMeasurementsResetAction = createAction('@MEASUREMENTS/RESET_MEASUREMENTS_RESET')<
  undefined
>();

export const resetMeasurementsAction = createAsyncAction(
  '@MEASUREMENTS/RESET_MEASUREMENTS_REQUEST',
  '@MEASUREMENTS/RESET_MEASUREMENTS_SUCCESS',
  '@MEASUREMENTS/RESET_MEASUREMENTS_FAILURE',
)<undefined, undefined, Error>();
