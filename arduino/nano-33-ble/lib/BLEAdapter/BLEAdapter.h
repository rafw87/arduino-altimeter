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

#endif
