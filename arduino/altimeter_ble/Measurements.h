#ifndef _MEASUREMENTS_H_
#define _MEASUREMENTS_H_

#define BATTERY_LEVEL A7
#define BATTERY_EMPTY_READING 570
#define BATTERY_FULL_READING 770
#define ALTITUDE_HISTERESIS 0.3f

#include "SensorAdapter.h"

class Measurements {
public:
    void init();

    void update();

    uint8_t getBatteryLevel(void);

    uint16_t getBatteryReading(void);

    uint16_t getMinBatteryReading(void);

    float getTemperature(void);

    float getHumidity(void);

    float getPressure(void);

    float getRawAltitude(void);

    float getAltitude(void);

    float getSeaLevelPressure(void);

    float getMinAltitude(void);

    float getMaxAltitude(void);

    float getAvgAltitude(void);

    float getTotalAscend(void);

    float getTotalDescend(void);

    void setAltitude(float altitude);

    void setSeaLevelPressure(float seaLevelPressure);

private:
    SensorAdapter sensor;
    uint16_t minBatteryReading = 0xffff;
    float altitude;
    float minAltitude;
    float maxAltitude;
    float avgAltitude;
    float totalAscend;
    float totalDescend;
    int counter;

    float getFixedAltitude(float rawAltitude);

    void recalculateMinMaxAvg();
};

void Measurements::init() {
    sensor.init();
    delay(300);

    float rawAltitude = sensor.getAltitude();
    altitude = round(rawAltitude);
    minAltitude = altitude;
    maxAltitude = altitude;
    avgAltitude = altitude;
    totalAscend = 0;
    totalDescend = 0;
    counter = 1;
}

void Measurements::update() {
    float rawAltitude = sensor.getAltitude();
    float newAltitude = getFixedAltitude(rawAltitude);
    totalAscend = totalAscend + max(0, newAltitude - altitude);
    totalDescend = totalDescend + max(0, altitude - newAltitude);
    altitude = newAltitude;
    recalculateMinMaxAvg();
}

uint8_t Measurements::getBatteryLevel() {
    uint16_t batteryReading = getBatteryReading();
    return (uint8_t) constrain(map(batteryReading, BATTERY_EMPTY_READING, BATTERY_FULL_READING, 0, 100), 0, 100);
}

uint16_t Measurements::getBatteryReading() {
    uint16_t batteryReading = (uint16_t) analogRead(BATTERY_LEVEL);
    minBatteryReading = min(batteryReading, minBatteryReading);
    return batteryReading;
}

uint16_t Measurements::getMinBatteryReading() {
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

float Measurements::getAltitude() {
    return altitude;
}

float Measurements::getSeaLevelPressure() {
    return sensor.getSeaLevelPressure();
}

float Measurements::getMinAltitude() {
    return minAltitude;
}

float Measurements::getMaxAltitude() {
    return maxAltitude;
}

float Measurements::getAvgAltitude() {
    return avgAltitude;
}

float Measurements::getTotalAscend() {
    return totalAscend;
}

float Measurements::getTotalDescend() {
    return totalDescend;
}

void Measurements::setAltitude(float newAltitude) {
    sensor.setAltitude(newAltitude);
    float rawAltitude = sensor.getAltitude();
    altitude = getFixedAltitude(rawAltitude);
    recalculateMinMaxAvg();
}

void Measurements::setSeaLevelPressure(float newSeaLevelPressure) {
    sensor.setSeaLevelPressure(newSeaLevelPressure);
    float rawAltitude = sensor.getAltitude();
    altitude = getFixedAltitude(rawAltitude);
    recalculateMinMaxAvg();
}

float Measurements::getFixedAltitude(float rawAltitude) {
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

#endif
