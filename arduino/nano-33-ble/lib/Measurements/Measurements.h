#ifndef _MEASUREMENTS_H_
#define _MEASUREMENTS_H_

#define BATTERY_LEVEL A7
#define BATTERY_EMPTY_READING 570
#define BATTERY_FULL_READING 770
#define ALTITUDE_HISTERESIS 0.3f

#include <SensorAdapter.h>
#include <EEPROM.h>


class Measurements {
public:
    void init();

    void update();

    uint8_t getBatteryLevel();

    uint16_t getBatteryReading();

    uint16_t getMinBatteryReading() const;

    float getTemperature();

    float getHumidity();

    float getPressure();

    float getRawAltitude();

    float getAltitude() const;

    float getSeaLevelPressure();

    float getMinAltitude() const;

    float getMaxAltitude() const;

    float getAvgAltitude() const;

    float getTotalAscend() const;

    float getTotalDescend() const;

    void setAltitude(float altitude);

    void setSeaLevelPressure(float seaLevelPressure);

    void save();

    void load();

    void reset();

private:
    SensorAdapter sensor;
    EEPROM eeprom;
    uint16_t minBatteryReading = 0xffff;
    float altitude = 0;
    float minAltitude = 0;
    float maxAltitude = 0;
    float avgAltitude = 0;
    float totalAscend = 0;
    float totalDescend = 0;
    uint32_t counter = 0;

    float getFixedAltitude(float rawAltitude) const;

    void recalculateMinMaxAvg();
};

#endif
