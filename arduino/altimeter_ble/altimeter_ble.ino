#define BATTERY_LEVEL A7
#define BATTERY_EMPTY_READING 310
#define BATTERY_FULL_READING 615
#define ALTITUDE_HISTERESIS 0.3f

#define BLE_QUERY_INTERVAL 500
#define DATA_ACQUISITION_INTERVAL 1000
#define DATA_SEND_INTERVAL 3000

#include "BLEAdapter.h"
#include "SensorAdapter.h"

SensorAdapter sensor;

BLEAdapter ble;

short lastAltitude;
short minAltitude;
short maxAltitude;
float avgAltitude;
short totalAscend;
short totalDescend;
int counter;

unsigned long nextBLEQuery;
unsigned long nextDataRetrieval;
unsigned long nextDataSend;
bool connected = false;

void setup() {
  pinMode(BATTERY_LEVEL, INPUT);
  
  Serial.begin(115200);

  sensor.init();
  
  resetMeasurements();

  ble.altitude()->setEventHandler(BLEWritten, updateAltitude);
  ble.seaLevelPressure()->setEventHandler(BLEWritten, updateSeaLevelPressure);

  ble.init();
  ble.seaLevelPressure()->writeValue(sensor.getSeaLevelPressure());

  nextBLEQuery = millis() + BLE_QUERY_INTERVAL;
  nextDataRetrieval = millis() + DATA_ACQUISITION_INTERVAL;
  nextDataSend = millis() + DATA_SEND_INTERVAL;
}

void loop() {
  if (millis() > nextBLEQuery) {
    ble.connect();

    while(millis() > nextBLEQuery) nextBLEQuery += BLE_QUERY_INTERVAL;
  }
  if (millis() > nextDataRetrieval) {
    calculateMeasurements();
    
    while(millis() > nextDataRetrieval) nextDataRetrieval += DATA_ACQUISITION_INTERVAL;
  }
  if (millis() > nextDataSend) {
    float temperature = sensor.getTemperature();
    float humidity = sensor.getHumidity();
    float pressure = sensor.getPressure();
    float altitude = sensor.getAltitude();
    float seaLevelPressure = sensor.getSeaLevelPressure();
    float batteryLevel = getBatteryLevel();
    
    Serial.print("Temperature: ");
    Serial.println(temperature);
    Serial.print("Humidity: ");
    Serial.println(humidity);
    Serial.print("Pressure: ");
    Serial.println(pressure);
    Serial.print("Sea level pressure: ");
    Serial.println(seaLevelPressure);
    Serial.print("Altitude (raw): ");
    Serial.println(altitude);
    Serial.print("Altitude (fixed): ");
    Serial.println(lastAltitude);
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
    Serial.println();
  
    ble.temperature()->writeValue(temperature);
    ble.humidity()->writeValue(humidity);
    ble.pressure()->writeValue(pressure);
    ble.elevation()->writeValue(altitude);
    ble.altitude()->writeValue(lastAltitude);
    ble.minAltitude()->writeValue(minAltitude);
    ble.maxAltitude()->writeValue(maxAltitude);
    ble.avgAltitude()->writeValue(avgAltitude);
    ble.totalAscend()->writeValue(totalAscend);
    ble.totalDescend()->writeValue(totalDescend);
    ble.seaLevelPressure()->writeValue(seaLevelPressure);
    while(millis() > nextDataSend) nextDataSend += DATA_SEND_INTERVAL;
  }

  unsigned long nextEvent = min(nextBLEQuery, min(nextDataRetrieval, nextDataSend));
  long delayTime = nextEvent - millis();
  if(delayTime > 0) {
    delay(delayTime);
  }
}


void updateAltitude(BLEDevice central, BLECharacteristic characteristic) {
  float value = ble.altitude()->value();
  Serial.print("Updated altitude, written: ");
  Serial.println(value);
  sensor.setAltitude(value);
  updateMeasurements();
  ble.altitude()->writeValue(lastAltitude);
  ble.seaLevelPressure()->writeValue(sensor.getSeaLevelPressure());
}

void updateSeaLevelPressure(BLEDevice central, BLECharacteristic characteristic) {
  float value = ble.seaLevelPressure()->value();
  Serial.print("Updated sea level pressure, written: ");
  Serial.println(value);
  sensor.setSeaLevelPressure(value);
  updateMeasurements();
  ble.altitude()->writeValue(lastAltitude);
  ble.seaLevelPressure()->writeValue(sensor.getSeaLevelPressure());
}

void resetMeasurements() {
  float altitude = sensor.getAltitude();
  lastAltitude = round(altitude);
  minAltitude = lastAltitude;
  maxAltitude = lastAltitude;
  avgAltitude = altitude;
  totalAscend = 0;
  totalDescend = 0;
  counter = 1;
}

void calculateMeasurements() {
  float altitude = sensor.getAltitude();
  short fixedAltitude = getFixedAltitude(altitude);
  counter++;
  minAltitude = min(minAltitude, fixedAltitude);
  maxAltitude = max(maxAltitude, fixedAltitude);
  avgAltitude = avgAltitude + (altitude - avgAltitude) / (float)counter;
  totalAscend = totalAscend + max(0, fixedAltitude - lastAltitude);
  totalDescend = totalDescend + max(0, lastAltitude - fixedAltitude);
  lastAltitude = fixedAltitude;
}

void updateMeasurements() {
  float altitude = sensor.getAltitude();
  short fixedAltitude = getFixedAltitude(altitude);
  minAltitude = min(minAltitude, fixedAltitude);
  maxAltitude = max(maxAltitude, fixedAltitude);
  lastAltitude = fixedAltitude;
}

short getFixedAltitude(float rawAltitude) {
  if((rawAltitude > lastAltitude + 0.5f + ALTITUDE_HISTERESIS) || (rawAltitude < lastAltitude - 0.5f - ALTITUDE_HISTERESIS)) {
    return round(rawAltitude);
  }
  return lastAltitude;
}

float getBatteryLevel() {
  float batteryRaw = analogRead(BATTERY_LEVEL);
  return constrain(map(batteryRaw, BATTERY_EMPTY_READING, BATTERY_FULL_READING, 0, 100), 0, 100);
}
