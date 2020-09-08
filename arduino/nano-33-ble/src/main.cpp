#define DATA_SEND_INTERVAL 3000
#define FACTORY_RESET_PIN 12
#define FACTORY_RESET_DURATION 10000

#include <Arduino.h>
#include <BLEAdapter.h>
#include <Measurements.h>
#include <EEPROM.h>

Measurements measurements;
BLEAdapter ble;
EEPROM eeprom;

void writeAllMeasurements() {
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
}

// NOLINTNEXTLINE(performance-unnecessary-value-param)
void updateAltitude(BLEDevice, BLECharacteristic) {
    float value = ble.altitude()->value();
    Serial.print("Updated altitude, written: ");
    Serial.println(value);
    measurements.setAltitude(value);
    ble.altitude()->writeValue(measurements.getAltitude());
    ble.seaLevelPressure()->writeValue(measurements.getSeaLevelPressure());
}

// NOLINTNEXTLINE(performance-unnecessary-value-param)
void updateSeaLevelPressure(const BLEDevice, const BLECharacteristic) {
    float value = ble.seaLevelPressure()->value();
    Serial.print("Updated sea level pressure, written: ");
    Serial.println(value);
    measurements.setSeaLevelPressure(value);
    ble.altitude()->writeValue(measurements.getAltitude());
    ble.seaLevelPressure()->writeValue(measurements.getSeaLevelPressure());
}

// NOLINTNEXTLINE(performance-unnecessary-value-param)
void resetData(BLEDevice, BLECharacteristic) {
    Serial.println("Data reset requested.");
    measurements.reset();
    writeAllMeasurements();
}

void setup() {
    pinMode(FACTORY_RESET_PIN, INPUT_PULLUP);
    pinMode(LED_BUILTIN, OUTPUT);
    Serial.begin(115200);

    delay(100);

    measurements.init();

    ble.altitude()->setEventHandler(BLEWritten, updateAltitude);
    ble.seaLevelPressure()->setEventHandler(BLEWritten, updateSeaLevelPressure);
    ble.resetData()->setEventHandler(BLEWritten, resetData);
    ble.init();
    ble.seaLevelPressure()->writeValue(measurements.getSeaLevelPressure());
}

void loop() {
    if(digitalRead(FACTORY_RESET_PIN) == LOW) {
        unsigned long start = millis();
        bool aborted = false;
        while(millis() < start + FACTORY_RESET_DURATION) {
            if(digitalRead(FACTORY_RESET_PIN) != LOW) {
                aborted = true;
                break;
            }
            ble.poll(100);
        }
        if(!aborted) {
            eeprom.factoryReset();
            Serial.println("Factory reset performed.");
            digitalWrite(LED_BUILTIN, HIGH);
            delay(100);
            digitalWrite(LED_BUILTIN, LOW);
            NVIC_SystemReset();
        }
    }
    measurements.update();
    writeAllMeasurements();
    ble.poll(DATA_SEND_INTERVAL);
}
