import { BleError, BleManager, Device, LogLevel, Characteristic } from 'react-native-ble-plx';
import { Measurement } from '../../types';
import { BluetoothService, ConnectionStatus } from './IBluetoothService';
import { BluetoothServiceBase } from './BluetoothServiceBase';

const HEART_RATE_SERVICE_UUID = '180d';
const HEART_RATE_CHAR_UUID = '2a37';
export class MiBandBluetoothService extends BluetoothServiceBase implements BluetoothService {
  private manager: BleManager;
  private device: Device | null = null;

  constructor() {
    super();
    this.manager = new BleManager({
      restoreStateIdentifier: 'ArduinoAltimeter',
      restoreStateFunction: (restoredState) => {
        console.log('Trying to restore connected devices...', restoredState);
        const restoredDevice = restoredState?.connectedPeripherals?.find(
          (d) => d.serviceUUIDs?.includes(HEART_RATE_SERVICE_UUID) && this.filterDevice(d),
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

  private characteristicListener = (
    error: BleError | null,
    characteristic: Characteristic | null,
  ) => {
    if (error) {
      return console.error('characteristic error', JSON.stringify(error));
    }
    if (characteristic) {
      const { serviceUUID, uuid, value } = characteristic;
      console.log('received new characteristic update', serviceUUID, uuid, value);
    }
  };

  async writeMeasurementValue(measurement: Measurement, value: number) {
    return { measurement, value };
  }

  async resetMeasurements() {}

  private startDeviceScan() {
    this.manager.startDeviceScan([], {}, (error: BleError | null, scannedDevice: Device | null) => {
      if (error) {
        return console.log(error);
      }
      if (scannedDevice && this.filterDevice(scannedDevice)) {
        console.log('Device found:', scannedDevice?.name);
        this.manager.stopDeviceScan();
        this.connect(scannedDevice, false).catch(this.connectionErrorHandler);
      }
    });
  }

  private filterDevice(device: Device) {
    console.log('Device: ', device.id, device.name);
    // return device.id === 'FE:0D:67:F9:97:F6'; // Altimeter
    return device.id === 'C6:32:CC:24:D3:B7';
  }

  private async connect(foundDevice: Device, restored: boolean) {
    this.setStatus(ConnectionStatus.Connecting);
    const connectedDevice = (this.device = await foundDevice.connect());
    if (!restored) {
      console.log('Discovering services and characteristics...');
      await connectedDevice.discoverAllServicesAndCharacteristics();
    }
    this.setStatus(ConnectionStatus.Connected);
    console.log('Device connected.');
    connectedDevice.monitorCharacteristicForService(
      HEART_RATE_SERVICE_UUID,
      HEART_RATE_CHAR_UUID,
      this.characteristicListener,
    );
  }

  private connectionErrorHandler = (error: Error) => {
    console.error('Error during connecting to device', error);
    this.startDeviceScan();
  };
}
