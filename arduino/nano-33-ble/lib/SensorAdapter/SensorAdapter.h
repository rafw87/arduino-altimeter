#ifndef _SENSOR_ADAPTER_H_
#define _SENSOR_ADAPTER_H_

#include <Adafruit_BME280.h>

#define DEFAULT_SEA_LEVEL_PRESSURE 1013.25f;

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

    void resetSeaLevelPressure();

private:
    Adafruit_BME280 bme;
    float seaLevelPressure = DEFAULT_SEA_LEVEL_PRESSURE;

    void reset();
};

#endif
