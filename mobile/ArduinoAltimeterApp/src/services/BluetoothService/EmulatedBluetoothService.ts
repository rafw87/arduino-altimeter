import { Measurement } from '../../types';
import { getKeys } from '../../utils';
import { BluetoothService, ConnectionStatus, MeasurementValues } from './IBluetoothService';
import { BluetoothServiceBase } from './BluetoothServiceBase';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const initialMeasurements: { [key in Measurement]: number } = {
  temperature: 23.1,
  humidity: 32,
  pressure: 933,
  seaLevelPressure: 1023,
  altitude: 300,
  minAlt: 300,
  maxAlt: 1836,
  avgAlt: 801,
  ascend: 1911,
  descend: 1911,
};

export class EmulatedBluetoothService extends BluetoothServiceBase implements BluetoothService {
  private notifyTimeout: NodeJS.Timeout | null = null;

  constructor() {
    super();
    setTimeout(() => this.setConnecting(), 1000);
  }

  async writeMeasurementValue(measurement: Measurement, value: number) {
    await delay(10);
    this.updateMeasurements({ [measurement]: value });
    return { measurement, value };
  }

  private setConnecting() {
    this.setStatus(ConnectionStatus.Connecting);
    setTimeout(() => this.setConnected(), 3000);
  }

  private setConnected() {
    this.setStatus(ConnectionStatus.Connected);
    this.updateMeasurements({ ...initialMeasurements });
    this.startSendingMeasurements();
    setTimeout(() => this.setDisconnected(), 15000);
  }

  private setDisconnected() {
    this.setStatus(ConnectionStatus.Disconnected);
    if (this.notifyTimeout) {
      clearTimeout(this.notifyTimeout);
      this.notifyTimeout = null;
    }
    setTimeout(() => this.setConnecting(), 10000);
  }

  private startSendingMeasurements() {
    this.notifyTimeout = setInterval(() => {
      const measurements = getKeys(Measurement).reduce((result, measurement) => {
        const oldValue = this.lastMeasurements[measurement];
        measurements[measurement] =
          oldValue == null ? null : Math.round(oldValue + (Math.random() * 2 - 1) * 5);
        return result;
      }, {} as MeasurementValues);
      this.updateMeasurements(measurements);
    }, 3000);
  }
}
