#define BATTERY_LEVEL A7
#define BATTERY_EMPTY_READING 310
#define BATTERY_FULL_READING 615

#define DATA_SEND_INTERVAL 3000

#include "BLEAdapter.h"
#include "Measurements.h"

Measurements measurements;
BLEAdapter ble;

void setup() {
    pinMode(BATTERY_LEVEL, INPUT);

    Serial.begin(115200);

    delay(5000);

    measurements.init();

    ble.altitude()->setEventHandler(BLEWritten, updateAltitude);
    ble.seaLevelPressure()->setEventHandler(BLEWritten, updateSeaLevelPressure);

    ble.init();
    ble.seaLevelPressure()->writeValue(measurements.getSeaLevelPressure());
}

void loop() {
    measurements.update();

    float temperature = measurements.getTemperature();
    float humidity = measurements.getHumidity();
    float pressure = measurements.getPressure();
    float rawAltitude = measurements.getRawAltitude();
    float altitude = measurements.getAltitude();
    float minAltitude = measurements.getMinAltitude();
    float maxAltitude = measurements.getMaxAltitude();
    float avgAltitude = measurements.getAvgAltitude();
    float totalAscend = measurements.getTotalAscend();
    float totalDescend = measurements.getTotalDescend();
    float seaLevelPressure = measurements.getSeaLevelPressure();
    uint8_t batteryLevel = measurements.getBatteryLevel();
    uint16_t batteryReading = measurements.getBatteryReading();
    uint16_t minBatteryReading = measurements.getMinBatteryReading();

    Serial.print("Temperature: ");
    Serial.println(temperature);
    Serial.print("Humidity: ");
    Serial.println(humidity);
    Serial.print("Pressure: ");
    Serial.println(pressure);
    Serial.print("Sea level pressure: ");
    Serial.println(seaLevelPressure);
    Serial.print("Altitude (raw): ");
    Serial.println(rawAltitude);
    Serial.print("Altitude (fixed): ");
    Serial.println(altitude);
    Serial.print("Altitude (min): ");
    Serial.println(minAltitude);
    Serial.print("Altitude (max): ");
    Serial.println(maxAltitude);
    Serial.print("Altitude (avg): ");
    Serial.println(avgAltitude);
    Serial.print("Total ascend: ");
    Serial.println(totalAscend);
    Serial.print("Total descend: ");
    Serial.println(totalDescend);
    Serial.print("Battery level: ");
    Serial.println(batteryLevel);
    Serial.print("Battery reading: ");
    Serial.println(batteryReading);
    Serial.print("Battery reading (min): ");
    Serial.println(minBatteryReading);
    Serial.println();

    ble.batteryLevel()->writeValue(batteryLevel);
    ble.batteryReading()->writeValue(batteryReading);
    ble.minBatteryReading()->writeValue(minBatteryReading);
    ble.temperature()->writeValue(temperature);
    ble.humidity()->writeValue(humidity);
    ble.pressure()->writeValue(pressure);
    ble.elevation()->writeValue(rawAltitude);
    ble.altitude()->writeValue(altitude);
    ble.minAltitude()->writeValue(minAltitude);
    ble.maxAltitude()->writeValue(maxAltitude);
    ble.avgAltitude()->writeValue(avgAltitude);
    ble.totalAscend()->writeValue(totalAscend);
    ble.totalDescend()->writeValue(totalDescend);
    ble.seaLevelPressure()->writeValue(seaLevelPressure);

    ble.poll(DATA_SEND_INTERVAL);
}


void updateAltitude(BLEDevice central, BLECharacteristic characteristic) {
    float value = ble.altitude()->value();
    Serial.print("Updated altitude, written: ");
    Serial.println(value);
    measurements.setAltitude(value);
    ble.altitude()->writeValue(measurements.getAltitude());
    ble.seaLevelPressure()->writeValue(measurements.getSeaLevelPressure());
}

void updateSeaLevelPressure(BLEDevice central, BLECharacteristic characteristic) {
    float value = ble.seaLevelPressure()->value();
    Serial.print("Updated sea level pressure, written: ");
    Serial.println(value);
    measurements.setSeaLevelPressure(value);
    ble.altitude()->writeValue(measurements.getAltitude());
    ble.seaLevelPressure()->writeValue(measurements.getSeaLevelPressure());
}
