#ifndef _BLE_ADAPTER_H_
#define _BLE_ADAPTER_H_

#define BATTERY_SERVICE_UUID          "180F"
#define BATTERY_LEVEL_CHAR            "2A19"
#define BATTERY_READING_CHAR          "47f969cc-ed59-11ea-adc1-0242ac120002"
#define MIN_BATTERY_READING_CHAR   "47f96c24-ed59-11ea-adc1-0242ac120002"

#define ALTIMETER_SERVICE_UUID        "7f7f23fe-e981-11ea-adc1-0242ac120002"
#define ALTITUDE_CHAR_UUID            "7f7f2638-e981-11ea-adc1-0242ac120002"
#define SEA_LEVEL_PRESS_CHAR_UUID     "7f7f2728-e981-11ea-adc1-0242ac120002"
#define MIN_ALTITUDE_CHAR_UUID        "7f7f27fa-e981-11ea-adc1-0242ac120002"
#define MAX_ALTITUDE_CHAR_UUID        "7f7f28cc-e981-11ea-adc1-0242ac120002"
#define AVG_ALTITUDE_CHAR_UUID        "7f7f2994-e981-11ea-adc1-0242ac120002"
#define TOTAL_ASCEND_CHAR_UUID        "7f7f2a5c-e981-11ea-adc1-0242ac120002"
#define TOTAL_DESCEND_CHAR_UUID       "7f7f2c1e-e981-11ea-adc1-0242ac120002"
// Future use:
// 7f7f2cdc-e981-11ea-adc1-0242ac120002
// 7f7f2da4-e981-11ea-adc1-0242ac120002
// 7f7f2e62-e981-11ea-adc1-0242ac120002
// 7f7f31b4-e981-11ea-adc1-0242ac120002
// 7f7f3286-e981-11ea-adc1-0242ac120002
// 7f7f3344-e981-11ea-adc1-0242ac120002
// 7f7f33f8-e981-11ea-adc1-0242ac120002


#include <ArduinoBLE.h>
#include "BLENumericCharacteristic.h"

using BatteryLevelCharacteristic = BLENumericCharacteristic<uint8_t>;
using BatteryReadingCharacteristic = BLENumericCharacteristic<uint16_t>;
using TemperatureCharacteristic = BLENumericCharacteristic<int16_t>;
using HumidityCharacteristic = BLENumericCharacteristic<uint16_t>;
using PressureCharacteristic = BLENumericCharacteristic<uint32_t>;
using ElevationCharacteristic = BLENumericCharacteristic<int32_t>;
using SeaLevelPressureCharacteristic = BLENumericCharacteristic<uint32_t>;
using AltitudeCharacteristic = BLENumericCharacteristic<int32_t>;
using MinAltitudeCharacteristic = BLENumericCharacteristic<int32_t>;
using MaxAltitudeCharacteristic = BLENumericCharacteristic<int32_t>;
using AvgAltitudeCharacteristic = BLENumericCharacteristic<int32_t>;
using TotalAscendCharacteristic = BLENumericCharacteristic<uint32_t>;
using TotalDescendCharacteristic = BLENumericCharacteristic<uint32_t>;


class BLEAdapter {
public:
    BLEAdapter();

    BatteryLevelCharacteristic *batteryLevel();

    BatteryReadingCharacteristic *batteryReading();

    BatteryReadingCharacteristic *minBatteryReading();

    TemperatureCharacteristic *temperature();

    HumidityCharacteristic *humidity();

    PressureCharacteristic *pressure();

    ElevationCharacteristic *elevation();

    SeaLevelPressureCharacteristic *seaLevelPressure();

    AltitudeCharacteristic *altitude();

    MinAltitudeCharacteristic *minAltitude();

    MaxAltitudeCharacteristic *maxAltitude();

    AvgAltitudeCharacteristic *avgAltitude();

    TotalAscendCharacteristic *totalAscend();

    TotalDescendCharacteristic *totalDescend();

    void init();

    void poll(unsigned long timeout);

    void sync();

private:
    bool isConnected = false;
    BatteryLevelCharacteristic batteryLevelChar;
    BatteryReadingCharacteristic batteryReadingChar;
    BatteryReadingCharacteristic minBatteryReadingChar;
    TemperatureCharacteristic temperatureChar;
    HumidityCharacteristic humidityChar;
    PressureCharacteristic pressureChar;
    ElevationCharacteristic elevationChar;
    SeaLevelPressureCharacteristic seaLevelPressureChar;
    AltitudeCharacteristic altitudeChar;
    MinAltitudeCharacteristic minAltitudeChar;
    MaxAltitudeCharacteristic maxAltitudeChar;
    AvgAltitudeCharacteristic avgAltitudeChar;
    TotalAscendCharacteristic totalAscendChar;
    TotalDescendCharacteristic totalDescendChar;
};

BLEAdapter::BLEAdapter()
        : batteryLevelChar(BATTERY_LEVEL_CHAR, BLERead | BLENotify, 1, 0, 0),
          batteryReadingChar(BATTERY_READING_CHAR, BLERead | BLENotify, 1, 0, 0),
          minBatteryReadingChar(MIN_BATTERY_READING_CHAR, BLERead | BLENotify, 1, 0, 0),
          temperatureChar("2A1F", BLERead | BLENotify, 1, -2, 0), humidityChar("2A6F", BLERead | BLENotify, 1, -2, 0),
          pressureChar("2A6D", BLERead | BLENotify, 1, -1, 0), elevationChar("2A6C", BLERead | BLENotify, 1, -2, 0),
          seaLevelPressureChar(SEA_LEVEL_PRESS_CHAR_UUID, BLERead | BLEWrite | BLENotify, 1, -1, 0),
          altitudeChar(ALTITUDE_CHAR_UUID, BLERead | BLEWrite | BLENotify, 1, -2, 0),
          minAltitudeChar(MIN_ALTITUDE_CHAR_UUID, BLERead | BLENotify, 1, -2, 0),
          maxAltitudeChar(MAX_ALTITUDE_CHAR_UUID, BLERead | BLENotify, 1, -2, 0),
          avgAltitudeChar(AVG_ALTITUDE_CHAR_UUID, BLERead | BLENotify, 1, -2, 0),
          totalAscendChar(TOTAL_ASCEND_CHAR_UUID, BLERead | BLENotify, 1, -2, 0),
          totalDescendChar(TOTAL_DESCEND_CHAR_UUID, BLERead | BLENotify, 1, -2, 0) {
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

void BLEAdapter::init() {
    while (!BLE.begin()) {
        Serial.println("starting BLE failed!");
        delay(1000);
    }

    BLE.setEventHandler(BLEConnected, [](BLEDevice central) {
        Serial.print("Connected to central: ");
        Serial.println(central.address());
    });
    BLE.setEventHandler(BLEDisconnected, [](BLEDevice central) {
        Serial.print("Disconnected from central: ");
        Serial.println(central.address());
        BLE.disconnect();
        BLE.advertise();
    });

    BLE.setLocalName("Arduino Altimeter");

    BLEService batteryService(BATTERY_SERVICE_UUID);
    BLE.setAdvertisedService(batteryService);
    batteryService.addCharacteristic(batteryLevelChar);
    batteryService.addCharacteristic(batteryReadingChar);
    batteryService.addCharacteristic(minBatteryReadingChar);
    BLE.addService(batteryService);

    BLEService environmentalService("181A");
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
    BLE.addService(altimeterService);

    BLE.advertise();
    Serial.println("Bluetooth device active, waiting for connections...");
}

void BLEAdapter::poll(unsigned long timeout) {
    BLE.poll(timeout);
}

void BLEAdapter::sync() {
    if (BLE.connected()) {
        batteryLevelChar.writeValue();
        batteryReadingChar.writeValue();
        minBatteryReadingChar.writeValue();
        temperatureChar.writeValue();
        humidityChar.writeValue();
        pressureChar.writeValue();
        elevationChar.writeValue();
        seaLevelPressureChar.writeValue();
        altitudeChar.writeValue();
        minAltitudeChar.writeValue();
        maxAltitudeChar.writeValue();
        avgAltitudeChar.writeValue();
        totalAscendChar.writeValue();
        totalDescendChar.writeValue();
    }
}

#endif
