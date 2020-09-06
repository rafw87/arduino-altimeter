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

    void save();

    void load();

private:
    SensorAdapter sensor;
    EEPROM eeprom;
    uint16_t minBatteryReading = 0xffff;
    float altitude;
    float minAltitude;
    float maxAltitude;
    float avgAltitude;
    float totalAscend;
    float totalDescend;
    uint32_t counter;

    float getFixedAltitude(float rawAltitude);

    void recalculateMinMaxAvg();
};

#endif
