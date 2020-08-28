import { Measurement } from '../types';
import {
  BluetoothService,
  MeasurementValues,
  MeasurementsSubscriptionHandler,
} from './BluetoothService';
import { getKeys } from '../utils';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Subscription = {
  measurementsSet: Set<Measurement>;
  handler: MeasurementsSubscriptionHandler;
};

export class EmulatedService implements BluetoothService {
  private measurements: { [key in Measurement]: number | null } = {
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
  private subscriptions: Subscription[] = [];

  constructor() {
    this.startSendingMeasurements();
  }

  get allMeasurements(): Measurement[] {
    return Object.keys(this.measurements) as Measurement[];
  }

  async writeMeasurementValue(measurement: Measurement, value: number) {
    await delay(10);
    this.measurements[measurement] = value;
    return { measurement, value };
  }

  subscribeForMeasurements(
    measurements: Measurement[],
    handler: MeasurementsSubscriptionHandler,
  ): void {
    const measurementsSet = new Set(measurements);
    let subscription = this.subscriptions.find((s) => s.handler === handler);
    if (subscription) {
      subscription.measurementsSet = measurementsSet;
    } else {
      subscription = {
        measurementsSet,
        handler,
      };
      this.subscriptions.push(subscription);
    }
    setTimeout(() => this.notifyMeasurementsSubscriber(subscription!, this.measurements), 0);
  }

  private startSendingMeasurements() {
    setInterval(() => {
      this.allMeasurements.forEach((measurement) => {
        const oldValue = this.measurements[measurement];
        if (oldValue != null) {
          this.measurements[measurement] = Math.round(oldValue + (Math.random() * 2 - 1) * 5);
        }
      });
      this.notifyMeasurementsChange({ ...this.measurements });
    }, 3000);
  }

  private notifyMeasurementsChange(measurements: MeasurementValues) {
    this.subscriptions.forEach((subscription) => {
      this.notifyMeasurementsSubscriber(subscription, measurements);
    });
  }

  private notifyMeasurementsSubscriber(
    subscription: Subscription,
    measurements: MeasurementValues,
  ) {
    const measurementsToSend = getKeys(measurements).reduce((result, measurement) => {
      if (subscription.measurementsSet.has(measurement)) {
        result[measurement] = measurements[measurement];
      }
      return result;
    }, {} as MeasurementValues);
    if (Object.keys(measurementsToSend).length > 0) {
      subscription.handler(measurementsToSend);
    }
  }
}
