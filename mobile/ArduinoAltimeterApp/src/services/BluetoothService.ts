import { Measurement } from '../types';

export type ConnectionStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED';
export type MeasurementValues = { [measurement in Measurement]?: number | null };
export type StatusSubscriptionHandler = (connection: ConnectionStatus) => void;
export type MeasurementsSubscriptionHandler = (measurements: MeasurementValues) => void;

export interface BluetoothService {
  readonly allMeasurements: Measurement[];
  writeMeasurementValue(
    measurement: Measurement,
    value: number,
  ): Promise<{ measurement: Measurement; value: number }>;
  subscribeForStatus(handler: StatusSubscriptionHandler): void;
  subscribeForMeasurements(
    measurements: Measurement | Measurement[] | 'all',
    handler: MeasurementsSubscriptionHandler,
  ): void;
}
