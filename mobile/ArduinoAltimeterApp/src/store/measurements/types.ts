import { Measurement } from '../../types';

export enum ResetState {
  Ready,
  WaitingForConfirmation,
  StatusNotification,
}

export type MeasurementState = {
  draftValue: number | null;
  requestedValue: number | null;
  actualValue: number | null;
  saveInProgress: boolean;
  error: Error | null;
  editMode: boolean;
};
export type MeasurementsReducer = {
  measurements: {
    [key in Measurement]: MeasurementState;
  };
  resetState: ResetState;
  resetInProgress: boolean;
  resetError: Error | null;
};

export type { MeasurementValues } from '../../services';
