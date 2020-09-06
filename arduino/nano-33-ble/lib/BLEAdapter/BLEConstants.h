#ifndef NANO_33_BLE_BLECONSTANTS_H
#define NANO_33_BLE_BLECONSTANTS_H

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
#define RESET_DATA_CHAR_UUID          "7f7f2cdc-e981-11ea-adc1-0242ac120002"
// Future use:
// 7f7f2da4-e981-11ea-adc1-0242ac120002
// 7f7f2e62-e981-11ea-adc1-0242ac120002
// 7f7f31b4-e981-11ea-adc1-0242ac120002
// 7f7f3286-e981-11ea-adc1-0242ac120002
// 7f7f3344-e981-11ea-adc1-0242ac120002
// 7f7f33f8-e981-11ea-adc1-0242ac120002

#define ENVIRONMENTAL_SERVICE_UUID "181A"
#define TEMPERATURE_CHAR "2A1F"
#define HUMIDITY_CHAR "2A6F"
#define PRESSURE_CHAR "2A6D"
#define ELEVATION_CHAR "2A6C"

#endif //NANO_33_BLE_BLECONSTANTS_H
