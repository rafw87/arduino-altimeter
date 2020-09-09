#include "BLEAdapter.h"

#define AUTORESTART_PIN 11

BLEAdapter::BLEAdapter()
        : batteryLevelChar(BATTERY_LEVEL_CHAR, BLERead | BLENotify, 1, 0, 0),
          batteryReadingChar(BATTERY_READING_CHAR, BLERead | BLENotify, 1, 0, 0),
          minBatteryReadingChar(MIN_BATTERY_READING_CHAR, BLERead | BLENotify, 1, 0, 0),
          temperatureChar(TEMPERATURE_CHAR, BLERead | BLENotify, 1, -2, 0),
          humidityChar(HUMIDITY_CHAR, BLERead | BLENotify, 1, -2, 0),
          pressureChar(PRESSURE_CHAR, BLERead | BLENotify, 1, -1, 0),
          elevationChar(ELEVATION_CHAR, BLERead | BLENotify, 1, -2, 0),
          seaLevelPressureChar(SEA_LEVEL_PRESS_CHAR_UUID, BLERead | BLEWrite | BLENotify, 1, -1, 0),
          altitudeChar(ALTITUDE_CHAR_UUID, BLERead | BLEWrite | BLENotify, 1, -2, 0),
          minAltitudeChar(MIN_ALTITUDE_CHAR_UUID, BLERead | BLENotify, 1, -2, 0),
          maxAltitudeChar(MAX_ALTITUDE_CHAR_UUID, BLERead | BLENotify, 1, -2, 0),
          avgAltitudeChar(AVG_ALTITUDE_CHAR_UUID, BLERead | BLENotify, 1, -2, 0),
          totalAscendChar(TOTAL_ASCEND_CHAR_UUID, BLERead | BLENotify, 1, -2, 0),
          totalDescendChar(TOTAL_DESCEND_CHAR_UUID, BLERead | BLENotify, 1, -2, 0),
          resetDataChar(RESET_DATA_CHAR_UUID, BLEWrite) {
}

BatteryLevelCharacteristic *BLEAdapter::batteryLevel() {
    return &batteryLevelChar;
}

BatteryReadingCharacteristic *BLEAdapter::batteryReading() {
    return &batteryReadingChar;
}

BatteryReadingCharacteristic *BLEAdapter::minBatteryReading() {
    return &minBatteryReadingChar;
}

TemperatureCharacteristic *BLEAdapter::temperature() {
    return &temperatureChar;
}

HumidityCharacteristic *BLEAdapter::humidity() {
    return &humidityChar;
}

PressureCharacteristic *BLEAdapter::pressure() {
    return &pressureChar;
}

ElevationCharacteristic *BLEAdapter::elevation() {
    return &elevationChar;
}

SeaLevelPressureCharacteristic *BLEAdapter::seaLevelPressure() {
    return &seaLevelPressureChar;
}

AltitudeCharacteristic *BLEAdapter::altitude() {
    return &altitudeChar;
}

MinAltitudeCharacteristic *BLEAdapter::minAltitude() {
    return &minAltitudeChar;
}

MaxAltitudeCharacteristic *BLEAdapter::maxAltitude() {
    return &maxAltitudeChar;
}

AvgAltitudeCharacteristic *BLEAdapter::avgAltitude() {
    return &avgAltitudeChar;
}

TotalAscendCharacteristic *BLEAdapter::totalAscend() {
    return &totalAscendChar;
}

TotalDescendCharacteristic *BLEAdapter::totalDescend() {
    return &totalDescendChar;
}

ResetDataCharacteristic *BLEAdapter::resetData() {
    return &resetDataChar;
}

void BLEAdapter::init() {
    while (!BLE.begin()) {
        Serial.println("starting BLE failed!");
        delay(1000);
    }

    // NOLINTNEXTLINE(performance-unnecessary-value-param)
    BLE.setEventHandler(BLEConnected, [](BLEDevice central) {
        Serial.print("Connected to central: ");
        Serial.println(central.address());
    });
    // NOLINTNEXTLINE(performance-unnecessary-value-param)
    BLE.setEventHandler(BLEDisconnected, [](BLEDevice central) {
        Serial.print("Disconnected from central: ");
        Serial.println(central.address());
        BLE.disconnect();
        BLE.stopAdvertise();
        BLE.advertise();
        if (digitalRead(AUTORESTART_PIN) == LOW) {
            Serial.println("Restarting device after disconnection...");
            delay(10);
            NVIC_SystemReset();
        }
    });

    BLE.setLocalName("Arduino Altimeter");

    BLEService batteryService(BATTERY_SERVICE_UUID);
    BLE.setAdvertisedService(batteryService);
    batteryService.addCharacteristic(batteryLevelChar);
    batteryService.addCharacteristic(batteryReadingChar);
    batteryService.addCharacteristic(minBatteryReadingChar);
    BLE.addService(batteryService);

    BLEService environmentalService(ENVIRONMENTAL_SERVICE_UUID);
    BLE.setAdvertisedService(environmentalService);
    environmentalService.addCharacteristic(temperatureChar);
    environmentalService.addCharacteristic(humidityChar);
    environmentalService.addCharacteristic(pressureChar);
    environmentalService.addCharacteristic(elevationChar);
    BLE.addService(environmentalService);

    BLEService altimeterService(ALTIMETER_SERVICE_UUID);
    BLE.setAdvertisedService(altimeterService);
    altimeterService.addCharacteristic(altitudeChar);
    altimeterService.addCharacteristic(seaLevelPressureChar);
    altimeterService.addCharacteristic(minAltitudeChar);
    altimeterService.addCharacteristic(maxAltitudeChar);
    altimeterService.addCharacteristic(avgAltitudeChar);
    altimeterService.addCharacteristic(totalAscendChar);
    altimeterService.addCharacteristic(totalDescendChar);
    altimeterService.addCharacteristic(resetDataChar);
    BLE.addService(altimeterService);

    BLE.advertise();
    Serial.println("Bluetooth device active, waiting for connections...");
}

void BLEAdapter::poll(unsigned long timeout) {
    unsigned long start = millis();
    while (millis() < start + timeout) {
        BLE.poll(timeout + start - millis());
    }
}
