#include <Arduino.h>
#include "Measurements.h"

#define EEPROM_SIGNATURE 0x12345678
#define EEPROM_VERSION 0x0002

#define EEPROM_HEADER_ADDRESS 0x00
#define EEPROM_DATA_ADDRESS 0x08

#define BATTERY_READING_EMA_MULTIPLIER 0.2f
#define ALTITUDE_EMA_MULTIPLIER 0.5f

struct EEPROMHeader {
    uint32_t signature = EEPROM_SIGNATURE;
    uint16_t version = EEPROM_VERSION;
    uint16_t flags = 0x0000;
};

struct EEPROMData {
    uint16_t minBatteryReading;
    float minAltitude;
    float maxAltitude;
    float avgAltitude;
    float totalAscend;
    float totalDescend;
    uint32_t counter;
    float seaLevelPressure;
};

void EMA(float &currentValue, float newValue, float multiplier) {
    currentValue = newValue * multiplier + currentValue * (1 - multiplier);
}

void Measurements::init() {
    pinMode(BATTERY_LEVEL, INPUT);
    sensor.init();
    setInitialValues();
    if (!eeprom.init()) {
        Serial.print("Cannot initialize EEPROM: ");
        Serial.println(eeprom.getLastResult());
    }
    delay(300);

    load();
}

void Measurements::update() {
    EMA(batteryReading, getBatteryReading(), BATTERY_READING_EMA_MULTIPLIER);
    EMA(rawAltitude, sensor.getAltitude(), ALTITUDE_EMA_MULTIPLIER);
    float newAltitude = getFixedAltitude();
    totalAscend = totalAscend + max(0, newAltitude - altitude);
    totalDescend = totalDescend + max(0, altitude - newAltitude);
    altitude = newAltitude;
    recalculateMinMaxAvg();
    save();
}

void Measurements::save() {
    EEPROMData data = {
            minBatteryReading,
            minAltitude,
            maxAltitude,
            avgAltitude,
            totalAscend,
            totalDescend,
            counter,
            getSeaLevelPressure()
    };
    eeprom.write<EEPROMData>(EEPROM_DATA_ADDRESS, data);
    if (eeprom.getLastResult() > 0) {
        Serial.print("Cannot write to EEPROM: ");
        Serial.println(eeprom.getLastResult());
    }
}

void Measurements::load() {
    EEPROMHeader header;
    eeprom.read<EEPROMHeader>(EEPROM_HEADER_ADDRESS, header);
    if (header.signature == EEPROM_SIGNATURE && header.version == EEPROM_VERSION) {
        Serial.println("EEPROM data found. Loading stored data...");
        EEPROMData data{};
        eeprom.read<EEPROMData>(EEPROM_DATA_ADDRESS, data);
        if (eeprom.getLastResult() > 0) {
            Serial.print("Cannot read from EEPROM: ");
            Serial.println(eeprom.getLastResult());
        }
        minBatteryReading = data.minBatteryReading;
        minAltitude = data.minAltitude;
        maxAltitude = data.maxAltitude;
        avgAltitude = data.avgAltitude;
        totalAscend = data.totalAscend;
        totalDescend = data.totalDescend;
        counter = data.counter;
        setSeaLevelPressure(data.seaLevelPressure);
    } else {
        Serial.println("No EEPROM data found. Formatting EEPROM...");
        EEPROMHeader newHeader;
        eeprom.write<EEPROMHeader>(EEPROM_HEADER_ADDRESS, newHeader);
        if (eeprom.getLastResult() > 0) {
            Serial.print("Cannot write header to EEPROM: ");
            Serial.println(eeprom.getLastResult());
        }
        reset();
    }
}

void Measurements::setInitialValues() {
    minBatteryReading = 0xffff;
    batteryReading = getBatteryReading();

    rawAltitude = sensor.getAltitude();
    altitude = getFixedAltitude();
    minAltitude = altitude;
    maxAltitude = altitude;
    avgAltitude = altitude;
    totalAscend = 0;
    totalDescend = 0;
    counter = 1;
}

void Measurements::reset() {
    setInitialValues();
    save();
}

uint8_t Measurements::getBatteryLevel() const {
    return (uint8_t) constrain(map(batteryReading, BATTERY_EMPTY_READING, BATTERY_FULL_READING, 0, 100), 0, 100);
}

uint16_t Measurements::getBatteryReading() {
    auto reading = (uint16_t) analogRead(BATTERY_LEVEL);
    minBatteryReading = min(reading, minBatteryReading);
    return reading;
}

uint16_t Measurements::getMinBatteryReading() const {
    return minBatteryReading;
}

float Measurements::getTemperature() {
    return sensor.getTemperature();
}

float Measurements::getHumidity() {
    return sensor.getHumidity();
}

float Measurements::getPressure() {
    return sensor.getPressure();
}

float Measurements::getRawAltitude() {
    return sensor.getAltitude();
}

float Measurements::getAltitude() const {
    return altitude;
}

float Measurements::getSeaLevelPressure() {
    return sensor.getSeaLevelPressure();
}

float Measurements::getMinAltitude() const {
    return minAltitude;
}

float Measurements::getMaxAltitude() const {
    return maxAltitude;
}

float Measurements::getAvgAltitude() const {
    return avgAltitude;
}

float Measurements::getTotalAscend() const {
    return totalAscend;
}

float Measurements::getTotalDescend() const {
    return totalDescend;
}

void Measurements::setAltitude(float newAltitude) {
    sensor.setAltitude(newAltitude);
    rawAltitude = sensor.getAltitude();
    altitude = getFixedAltitude();
    recalculateMinMaxAvg();
    save();
}

void Measurements::setSeaLevelPressure(float newSeaLevelPressure) {
    sensor.setSeaLevelPressure(newSeaLevelPressure);
    rawAltitude = sensor.getAltitude();
    altitude = getFixedAltitude();
    recalculateMinMaxAvg();
    save();
}

float Measurements::getFixedAltitude() const {
    if ((rawAltitude > altitude + 0.5f + ALTITUDE_HISTERESIS) ||
        (rawAltitude < altitude - 0.5f - ALTITUDE_HISTERESIS)) {
        return round(rawAltitude);
    }
    return altitude;
}

void Measurements::recalculateMinMaxAvg() {
    counter++;
    minAltitude = min(minAltitude, altitude);
    maxAltitude = max(maxAltitude, altitude);
    avgAltitude = avgAltitude + (altitude - avgAltitude) / (float) counter;
}
