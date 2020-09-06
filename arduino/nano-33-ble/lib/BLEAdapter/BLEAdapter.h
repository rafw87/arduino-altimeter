#ifndef _BLE_ADAPTER_H_
#define _BLE_ADAPTER_H_

#include <ArduinoBLE.h>
#include "BLENumericCharacteristic.h"
#include "BLEConstants.h"

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
using ResetDataCharacteristic = BLEByteCharacteristic;

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

    ResetDataCharacteristic *resetData();

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
    ResetDataCharacteristic resetDataChar;
};

#endif
