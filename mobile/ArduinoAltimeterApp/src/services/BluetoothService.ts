import { Measurement } from '../types';

export type MeasurementValues = { [measurement in Measurement]?: number | null };
export type MeasurementsSubscriptionHandler = (measurements: MeasurementValues) => void;

export interface BluetoothService {
  readonly allMeasurements: Measurement[];
  writeMeasurementValue(
    measurement: Measurement,
    value: number,
  ): Promise<{ measurement: Measurement; value: number }>;
  subscribeForMeasurements(
    measurements: Measurement | Measurement[] | 'all',
    handler: MeasurementsSubscriptionHandler,
  ): void;
}
