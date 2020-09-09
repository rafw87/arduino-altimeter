import { BleError, BleManager, Device, LogLevel, Characteristic } from 'react-native-ble-plx';
import { Base64 } from 'js-base64';
import { Measurement } from '../../types';
import { BluetoothService, ConnectionStatus } from './IBluetoothService';
import { BluetoothServiceBase } from './BluetoothServiceBase';
import {
  getKeys,
  Int16Encoder,
  Int32Encoder,
  NumericEncoder,
  Uint16Encoder,
  Uint32Encoder,
  Uint8Encoder,
} from '../../utils';

const ENVIRONMENTAL_SERVICE_UUID = '0000181a-0000-1000-8000-00805f9b34fb';
const TEMPERATURE_CHAR_UUID = '00002a1f-0000-1000-8000-00805f9b34fb';
const HUMIDITY_CHAR_UUID = '00002a6f-0000-1000-8000-00805f9b34fb';
const PRESSURE_CHAR_UUID = '00002a6d-0000-1000-8000-00805f9b34fb';

const ALTIMETER_SERVICE_UUID = '7f7f23fe-e981-11ea-adc1-0242ac120002';
const ALTITUDE_CHAR_UUID = '7f7f2638-e981-11ea-adc1-0242ac120002';
const SEA_LEVEL_PRESS_CHAR_UUID = '7f7f2728-e981-11ea-adc1-0242ac120002';
const MIN_ALTITUDE_CHAR_UUID = '7f7f27fa-e981-11ea-adc1-0242ac120002';
const MAX_ALTITUDE_CHAR_UUID = '7f7f28cc-e981-11ea-adc1-0242ac120002';
const AVG_ALTITUDE_CHAR_UUID = '7f7f2994-e981-11ea-adc1-0242ac120002';
const TOTAL_ASCEND_CHAR_UUID = '7f7f2a5c-e981-11ea-adc1-0242ac120002';
const TOTAL_DESCEND_CHAR_UUID = '7f7f2c1e-e981-11ea-adc1-0242ac120002';
const RESET_DATA_CHAR_UUID = '7f7f2cdc-e981-11ea-adc1-0242ac120002';

const BATTERY_SERVICE_UUID = '0000180f-0000-1000-8000-00805f9b34fb';
const BATTERY_LEVEL_CHAR_UUID = '00002a19-0000-1000-8000-00805f9b34fb';
const BATTERY_READING_CHAR_UUID = '47f969cc-ed59-11ea-adc1-0242ac120002';

const SERVICES = {
  [ENVIRONMENTAL_SERVICE_UUID]: {
    [TEMPERATURE_CHAR_UUID]: {
      measurement: Measurement.temperature,
      specification: {
        octets: 2,
        decimalExponent: -2,
        dataType: Int16Encoder,
      },
    },
    [HUMIDITY_CHAR_UUID]: {
      measurement: Measurement.humidity,
      specification: {
        octets: 2,
        decimalExponent: -2,
        dataType: Uint16Encoder,
      },
    },
    [PRESSURE_CHAR_UUID]: {
      measurement: Measurement.pressure,
      specification: {
        octets: 4,
        decimalExponent: -1,
        dataType: Uint32Encoder,
      },
    },
  },
  [ALTIMETER_SERVICE_UUID]: {
    [ALTITUDE_CHAR_UUID]: {
      measurement: Measurement.altitude,
      specification: {
        octets: 4,
        decimalExponent: -2,
        dataType: Int32Encoder,
      },
    },
    [SEA_LEVEL_PRESS_CHAR_UUID]: {
      measurement: Measurement.seaLevelPressure,
      specification: {
        octets: 4,
        decimalExponent: -1,
        dataType: Uint32Encoder,
      },
    },
    [MIN_ALTITUDE_CHAR_UUID]: {
      measurement: Measurement.minAlt,
      specification: {
        octets: 4,
        decimalExponent: -2,
        dataType: Int32Encoder,
      },
    },
    [MAX_ALTITUDE_CHAR_UUID]: {
      measurement: Measurement.maxAlt,
      specification: {
        octets: 4,
        decimalExponent: -2,
        dataType: Int32Encoder,
      },
    },
    [AVG_ALTITUDE_CHAR_UUID]: {
      measurement: Measurement.avgAlt,
      specification: {
        octets: 4,
        decimalExponent: -2,
        dataType: Int32Encoder,
      },
    },
    [TOTAL_ASCEND_CHAR_UUID]: {
      measurement: Measurement.ascend,
      specification: {
        octets: 4,
        decimalExponent: -2,
        dataType: Uint32Encoder,
      },
    },
    [TOTAL_DESCEND_CHAR_UUID]: {
      measurement: Measurement.descend,
      specification: {
        octets: 4,
        decimalExponent: -2,
        dataType: Uint32Encoder,
      },
    },
  },
  [BATTERY_SERVICE_UUID]: {
    [BATTERY_LEVEL_CHAR_UUID]: {
      measurement: Measurement.batteryLevel,
      specification: {
        octets: 1,
        decimalExponent: 0,
        dataType: Uint8Encoder,
      },
    },
    [BATTERY_READING_CHAR_UUID]: {
      measurement: Measurement.batteryReading,
      specification: {
        octets: 1,
        decimalExponent: 0,
        dataType: Uint16Encoder,
      },
    },
  },
};

type ServiceUUID = keyof typeof SERVICES;
type CharacteristicUUID<TService extends ServiceUUID> = keyof typeof SERVICES[TService];

type CharacteristicSpecification = {
  octets: number;
  decimalExponent: number;
  dataType: NumericEncoder;
};
type MeasurementCharacteristic = {
  serviceUUID: ServiceUUID;
  uuid: CharacteristicUUID<ServiceUUID>;
  specification: CharacteristicSpecification;
};
type MeasurementToCharacteristicMap = {
  [measurement in Measurement]?: MeasurementCharacteristic;
};

const MEASUREMENT_TO_CHARACTERISTIC = getKeys(SERVICES).reduce((result1, serviceUUID) => {
  return getKeys(SERVICES[serviceUUID]).reduce((result2, uuid) => {
    // @ts-ignore
    const { measurement, specification } = SERVICES[serviceUUID][uuid];
    return {
      ...result2,
      [measurement]: { serviceUUID, uuid, specification } as MeasurementCharacteristic,
    };
  }, result1);
}, {} as MeasurementToCharacteristicMap);

const decodeValue = (base64: string, specification: CharacteristicSpecification) => {
  const bytes = Base64.toUint8Array(base64);
  const value = specification.dataType.decode(bytes);
  return value * 10 ** specification.decimalExponent;
};

const encodeValue = (value: number, specification: CharacteristicSpecification) => {
  const { decimalExponent } = specification;
  const bytes = specification.dataType.encode(value / 10 ** decimalExponent);
  return Base64.fromUint8Array(bytes);
};

export class RealBluetoothService extends BluetoothServiceBase implements BluetoothService {
  private manager: BleManager;
  private device: Device | null = null;

  constructor() {
    super();
    this.manager = new BleManager({
      restoreStateIdentifier: 'ArduinoAltimeter',
      restoreStateFunction: (restoredState) => {
        const restoredDevice = restoredState?.connectedPeripherals?.find((d) =>
          d.serviceUUIDs?.includes(ALTIMETER_SERVICE_UUID),
        );
        if (restoredDevice) {
          console.log('Device restored:', restoredDevice?.name);
          this.connect(restoredDevice, true).catch(this.connectionErrorHandler);
        } else {
          console.log('Scanning for devices...');
          this.startDeviceScan();
        }
      },
    });
    this.manager.setLogLevel(LogLevel.Verbose);
  }

  async writeMeasurementValue(measurement: Measurement, value: number) {
    const characteristic = MEASUREMENT_TO_CHARACTERISTIC[measurement];
    if (!characteristic) {
      throw new Error(`There is no defined characteristic for measurement: '${measurement}'`);
    }
    if (!this.device) {
      throw new Error(`Device is not connected.`);
    }
    const { serviceUUID, uuid, specification } = characteristic;
    await this.device.writeCharacteristicWithResponseForService(
      serviceUUID,
      uuid,
      encodeValue(value, specification),
    );
    return { measurement, value };
  }

  async resetMeasurements() {
    if (!this.device) {
      throw new Error(`Device is not connected.`);
    }
    await this.device.writeCharacteristicWithResponseForService(
      ALTIMETER_SERVICE_UUID,
      RESET_DATA_CHAR_UUID,
      Base64.fromUint8Array(new Uint8Array([0])),
    );
  }

  private startDeviceScan() {
    this.manager.startDeviceScan(
      [ALTIMETER_SERVICE_UUID],
      {},
      (error: BleError | null, scannedDevice: Device | null) => {
        if (error) {
          return console.log(error);
        }
        if (scannedDevice) {
          console.log('Device found:', scannedDevice?.name);
          this.manager.stopDeviceScan();
          this.connect(scannedDevice, false).catch(this.connectionErrorHandler);
        }
      },
    );
  }

  private async connect(foundDevice: Device, restored: boolean) {
    this.setStatus(ConnectionStatus.Connecting);

    const connectedDevice = (this.device = await foundDevice.connect());
    if (!restored) {
      console.log('Discovering services and characteristics...');
      await connectedDevice.discoverAllServicesAndCharacteristics();
    }
    this.manager.onDeviceDisconnected(connectedDevice.id, this.disconnectHandler);

    getKeys(SERVICES).forEach((serviceUUID) => {
      getKeys(SERVICES[serviceUUID]).forEach((characteristicUUID) => {
        foundDevice
          .readCharacteristicForService(serviceUUID, characteristicUUID)
          .then((characteristic) => {
            this.processCharacteristicValue(characteristic);
          });
        foundDevice.monitorCharacteristicForService(
          serviceUUID,
          characteristicUUID,
          this.characteristicListener,
        );
      });
    });
    this.setStatus(ConnectionStatus.Connected);
  }

  private processCharacteristicValue(characteristic: Characteristic) {
    const { serviceUUID, uuid, value } = characteristic;
    // @ts-ignore
    const measurementDefinition = SERVICES?.[serviceUUID]?.[uuid];
    if (measurementDefinition && value) {
      const parsedValue = decodeValue(value, measurementDefinition.specification);
      this.updateMeasurements({ [measurementDefinition.measurement]: parsedValue });
      console.log('measurement updated', measurementDefinition.measurement, parsedValue);
    }
  }

  private characteristicListener = (
    error: BleError | null,
    characteristic: Characteristic | null,
  ) => {
    if (error) {
      return console.error('characteristic error', JSON.stringify(error));
    }
    try {
      if (characteristic) {
        const { serviceUUID, uuid, value } = characteristic;
        console.log('received new characteristic update', serviceUUID, uuid, value);
        this.processCharacteristicValue(characteristic);
      }
    } catch (e) {
      console.error(`Error during processing characteristic ${characteristic?.uuid}`, e);
    }
  };

  private disconnectHandler = (err: BleError | null, device: Device | null) => {
    if (err) {
      console.error('Device disconnecting error', err);
      return;
    }
    this.setStatus(ConnectionStatus.Disconnected);
    console.log(`Device ${device} disconnected.`);
    this.startDeviceScan();
  };

  private connectionErrorHandler = (error: Error) => {
    console.error('Error during connecting to device', error);
    this.startDeviceScan();
  };
}
