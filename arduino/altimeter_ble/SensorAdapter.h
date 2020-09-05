#ifndef _SENSOR_ADAPTER_H_
#define _SENSOR_ADAPTER_H_

#include <Adafruit_BME280.h>

class SensorAdapter {
public:
    void init();

    float getTemperature(void);

    float getHumidity(void);

    float getPressure(void);

    float getAltitude(void);

    float getSeaLevelPressure(void);

    void setAltitude(float value);

    void setSeaLevelPressure(float value);

private:
    Adafruit_BME280 bme;
    float seaLevelPressure = 1013.25f;

    void reset();
};

void SensorAdapter::init() {
    unsigned bme280Status = bme.begin(0x76);
    if (!bme280Status) {
        Serial.println("Could not find a valid BME280 sensor, check wiring, address, sensor ID!");
        Serial.print("SensorID was: 0x");
        Serial.println(bme.sensorID(), 16);
        Serial.print("        ID of 0xFF probably means a bad address, a BMP 180 or BMP 085\n");
        Serial.print("   ID of 0x56-0x58 represents a BMP 280,\n");
        Serial.print("        ID of 0x60 represents a BME 280.\n");
        Serial.print("        ID of 0x61 represents a BME 680.\n");
    } else {
        Serial.println("BME280 sensor initialized correctly.");
    }
}

void SensorAdapter::reset() {
    Serial.println("Resetting BME280...");
    init();
}

float SensorAdapter::getTemperature() {
    float temperature = bme.readTemperature();
    if (isnan(temperature)) {
        reset();
        temperature = bme.readTemperature();
    }
    return temperature;
}

float SensorAdapter::getHumidity() {
    float humidity = bme.readHumidity();
    if (isnan(humidity)) {
        reset();
        humidity = bme.readHumidity();
    }
    return humidity;
}

float SensorAdapter::getPressure() {
    float pressure = bme.readPressure() / 100;
    if (isnan(pressure)) {
        reset();
        pressure = bme.readPressure();
    }
    return pressure;
}

float SensorAdapter::getAltitude() {
    float altitude = bme.readAltitude(seaLevelPressure);
    if (isnan(altitude)) {
        reset();
        altitude = bme.readAltitude(seaLevelPressure);
    }
    return altitude;
}

void SensorAdapter::setAltitude(float value) {
    float pressure = getPressure();
    seaLevelPressure = bme.seaLevelForAltitude(value, pressure);
}

float SensorAdapter::getSeaLevelPressure() {
    return seaLevelPressure;
}

void SensorAdapter::setSeaLevelPressure(float value) {
    seaLevelPressure = value;
}

#endif
