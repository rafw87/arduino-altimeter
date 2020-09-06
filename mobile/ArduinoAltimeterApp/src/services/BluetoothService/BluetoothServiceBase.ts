import {
  BluetoothService,
  ConnectionStatus,
  MeasurementsSubscriptionHandler,
  MeasurementValues,
  StatusSubscriptionHandler,
} from './IBluetoothService';
import { getKeys } from '../../utils';
import { Measurement } from '../../types';
import { throttle } from 'lodash';

type StatusSubscription = {
  handler: StatusSubscriptionHandler;
};
type MeasurementsSubscription = {
  measurementsSet: Set<Measurement>;
  handler: MeasurementsSubscriptionHandler;
};

export abstract class BluetoothServiceBase implements BluetoothService {
  private status: ConnectionStatus = ConnectionStatus.Disconnected;

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
  private changedMeasurements: Set<Measurement> = new Set<Measurement>();
  private statusSubscriptions: StatusSubscription[] = [];
  private measurementsubscriptions: MeasurementsSubscription[] = [];

  get lastMeasurements() {
    return { ...this.measurements };
  }

  abstract writeMeasurementValue(
    measurement: Measurement,
    value: number,
  ): Promise<{ measurement: Measurement; value: number }>;

  abstract resetMeasurements(): Promise<void>;

  subscribeForMeasurements(
    measurements: Measurement[],
    handler: MeasurementsSubscriptionHandler,
  ): void {
    const measurementsSet = new Set(measurements);
    let subscription = this.measurementsubscriptions.find((s) => s.handler === handler);
    if (subscription) {
      subscription.measurementsSet = measurementsSet;
    } else {
      subscription = {
        measurementsSet,
        handler,
      };
      this.measurementsubscriptions.push(subscription);
    }
    setTimeout(() => this.notifyMeasurementsSubscriber(subscription!, this.measurements), 0);
  }

  protected setStatus(status: ConnectionStatus) {
    this.status = status;
    this.notifyStatusChange(status);
  }

  protected updateMeasurements(measurements: MeasurementValues) {
    getKeys(measurements).forEach((measurement) => {
      if (this.measurements[measurement] !== measurements[measurement]) {
        this.changedMeasurements.add(measurement);
      }
    });
    this.measurements = {
      ...this.measurements,
      ...measurements,
    };
    this.notifyMeasurementsChangeThrottled();
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

  private notifyStatusChange(status: ConnectionStatus) {
    this.statusSubscriptions.forEach((subscription) => {
      this.notifyStatusSubscriber(subscription, status);
    });
  }

  private notifyStatusSubscriber(subscription: StatusSubscription, status: ConnectionStatus) {
    subscription.handler(status);
  }

  private notifyMeasurementsChange() {
    const measurements = getKeys(this.measurements).reduce((result, measurement) => {
      if (this.changedMeasurements.has(measurement)) {
        result[measurement] = this.measurements[measurement];
      }
      return result;
    }, {} as MeasurementValues);
    if (getKeys(measurements).length > 0) {
      this.measurementsubscriptions.forEach((subscription) => {
        this.notifyMeasurementsSubscriber(subscription, measurements);
      });
    }
    this.changedMeasurements.clear();
  }

  private notifyMeasurementsChangeThrottled = throttle(() => this.notifyMeasurementsChange(), 100);

  private notifyMeasurementsSubscriber(
    subscription: MeasurementsSubscription,
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
