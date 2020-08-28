import { Measurement } from '../types';
import {
  BluetoothService,
  ConnectionStatus,
  MeasurementValues,
  StatusSubscriptionHandler,
  MeasurementsSubscriptionHandler,
} from './BluetoothService';
import { getKeys } from '../utils';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type StatusSubscription = {
  handler: StatusSubscriptionHandler;
};
type Subscription = {
  measurementsSet: Set<Measurement>;
  handler: MeasurementsSubscriptionHandler;
};

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

export class EmulatedService implements BluetoothService {
  private status: ConnectionStatus = 'DISCONNECTED';

  private measurements: { [key in Measurement]: number | null } = {
    temperature: null,
    humidity: null,
    pressure: null,
    seaLevelPressure: null,
    altitude: null,
    minAlt: null,
    maxAlt: null,
    avgAlt: null,
    ascend: null,
    descend: null,
  };
  private statusSubscriptions: StatusSubscription[] = [];
  private subscriptions: Subscription[] = [];
  private notifyTimeout: NodeJS.Timeout | null = null;

  constructor() {
    setTimeout(() => this.setConnecting(), 1000);
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

  subscribeForStatus(handler: StatusSubscriptionHandler) {
    let subscription = this.statusSubscriptions.find((s) => s.handler === handler);
    if (!subscription) {
      subscription = {
        handler,
      };
      this.statusSubscriptions.push(subscription);
    }
    setTimeout(() => this.notifyStatusSubscriber(subscription!, this.status), 0);
  }

  private setConnecting() {
    this.status = 'CONNECTING';
    this.notifyStatusChange(this.status);
    setTimeout(() => this.setConnected(), 3000);
  }

  private setConnected() {
    this.status = 'CONNECTED';
    this.notifyStatusChange(this.status);
    this.measurements = { ...initialMeasurements };
    this.startSendingMeasurements();
    setTimeout(() => this.setDisconnected(), 15000);
  }

  private setDisconnected() {
    this.status = 'DISCONNECTED';
    this.notifyStatusChange(this.status);
    if (this.notifyTimeout) {
      clearTimeout(this.notifyTimeout);
      this.notifyTimeout = null;
    }
    setTimeout(() => this.setConnecting(), 10000);
  }

  private startSendingMeasurements() {
    this.notifyMeasurementsChange({ ...this.measurements });
    this.notifyTimeout = setInterval(() => {
      this.allMeasurements.forEach((measurement) => {
        const oldValue = this.measurements[measurement];
        if (oldValue != null) {
          this.measurements[measurement] = Math.round(oldValue + (Math.random() * 2 - 1) * 5);
        }
      });
      this.notifyMeasurementsChange({ ...this.measurements });
    }, 3000);
  }

  private notifyStatusChange(status: ConnectionStatus) {
    this.statusSubscriptions.forEach((subscription) => {
      this.notifyStatusSubscriber(subscription, status);
    });
  }

  private notifyStatusSubscriber(subscription: StatusSubscription, status: ConnectionStatus) {
    subscription.handler(status);
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
