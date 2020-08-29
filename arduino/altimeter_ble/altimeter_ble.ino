#define BATTERY_LEVEL A7
#define BATTERY_EMPTY_READING 310
#define BATTERY_FULL_READING 615
#define ALTITUDE_HISTERESIS 0.3f

#define BLE_QUERY_INTERVAL 500
#define DATA_ACQUISITION_INTERVAL 1000
#define DATA_SEND_INTERVAL 3000

#include "BLEAdapter.h"
#include <Adafruit_BME280.h>

struct BME280Measurements {
  float temperature;
  float humidity;
  float pressure;
  float altitude;
};

Adafruit_BME280 bme;

BLEAdapter ble;

BME280Measurements bme280Measurements;
short lastAltitude;
short minAltitude;
short maxAltitude;
float avgAltitude;
short totalAscend;
short totalDescend;
int counter;


float seaLevelPressure = 1013.25;
unsigned bme280Status;

unsigned long nextBLEQuery;
unsigned long nextDataRetrieval;
unsigned long nextDataSend;
bool connected = false;

void setup() {
  pinMode(BATTERY_LEVEL, INPUT);
  
  Serial.begin(115200);

  initBME280();
  BME280Measurements bme280Measurements;
  getBME280MeasurementsTwice(&bme280Measurements);
  resetMeasurements(bme280Measurements);

  ble.altitude()->setEventHandler(BLEWritten, updateAltitude);
  ble.seaLevelPressure()->setEventHandler(BLEWritten, updateSeaLevelPressure);

  ble.init();
  ble.seaLevelPressure()->writeValue(seaLevelPressure);

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
    getBME280MeasurementsTwice(&bme280Measurements);
    calculateMeasurements(bme280Measurements);
    
    while(millis() > nextDataRetrieval) nextDataRetrieval += DATA_ACQUISITION_INTERVAL;
  }
  if (millis() > nextDataSend) {
    float batteryLevel = getBatteryLevel();
    
    Serial.print("Temperature: ");
    Serial.println(bme280Measurements.temperature);
    Serial.print("Humidity: ");
    Serial.println(bme280Measurements.humidity);
    Serial.print("Pressure: ");
    Serial.println(bme280Measurements.pressure);
    Serial.print("Sea level pressure: ");
    Serial.println(seaLevelPressure);
    Serial.print("Altitude (raw): ");
    Serial.println(bme280Measurements.altitude);
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
  
    ble.temperature()->writeValue(bme280Measurements.temperature);
    ble.humidity()->writeValue(bme280Measurements.humidity);
    ble.pressure()->writeValue(bme280Measurements.pressure);
    ble.altitude()->writeValue(bme280Measurements.altitude);
    ble.minAltitude()->writeValue(minAltitude);
    ble.maxAltitude()->writeValue(maxAltitude);
    ble.avgAltitude()->writeValue(avgAltitude);
    ble.totalAscend()->writeValue(totalAscend);
    ble.totalDescend()->writeValue(totalDescend);

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
  seaLevelPressure = bme.seaLevelForAltitude(value, bme.readPressure() * 0.01f);
  BME280Measurements bme280Measurements;
  getBME280MeasurementsTwice(&bme280Measurements);
  updateMeasurements(bme280Measurements);
  ble.altitude()->writeValue(lastAltitude);
  ble.seaLevelPressure()->writeValue(seaLevelPressure);
}

void updateSeaLevelPressure(BLEDevice central, BLECharacteristic characteristic) {
  float value = ble.seaLevelPressure()->value();
  Serial.print("Updated sea level pressure, written: ");
  Serial.println(value);
  seaLevelPressure = value;
  BME280Measurements bme280Measurements;
  getBME280MeasurementsTwice(&bme280Measurements);
  updateMeasurements(bme280Measurements);
  ble.altitude()->writeValue(lastAltitude);
  ble.seaLevelPressure()->writeValue(seaLevelPressure);
}

bool getBME280Measurements(BME280Measurements *measurements) {
  float temperature = bme.readTemperature();
  float humidity = bme.readHumidity();
  float pressure = bme.readPressure() * 0.01f;
  float altitude = bme.readAltitude(seaLevelPressure);
  if(isnan(temperature) || isnan(humidity) || isnan(pressure) || isnan(altitude)) {
    measurements->temperature = 0;
    measurements->humidity = 0;
    measurements->pressure = 0;
    measurements->altitude = 0;
    return false;
  } else {
    measurements->temperature = temperature;
    measurements->humidity = humidity;
    measurements->pressure = pressure;
    measurements->altitude = altitude;
    return true;
  }
}

bool getBME280MeasurementsTwice(BME280Measurements *bme280Measurements) {
  if(!getBME280Measurements(bme280Measurements)) {
    Serial.println("BME280 is disconnected, connecting again...");
    initBME280();
    getBME280Measurements(bme280Measurements);
  }
}

void resetMeasurements(BME280Measurements bme280Measurements) {
  lastAltitude = round(bme280Measurements.altitude);
  minAltitude = lastAltitude;
  maxAltitude = lastAltitude;
  avgAltitude = bme280Measurements.altitude;
  totalAscend = 0;
  totalDescend = 0;
  counter = 1;
}

void calculateMeasurements(BME280Measurements bme280Measurements) {
  short fixedAltitude = getFixedAltitude(bme280Measurements.altitude);
  counter++;
  minAltitude = min(minAltitude, fixedAltitude);
  maxAltitude = max(maxAltitude, fixedAltitude);
  avgAltitude = avgAltitude + (bme280Measurements.altitude - avgAltitude) / (float)counter;
  totalAscend = totalAscend + max(0, fixedAltitude - lastAltitude);
  totalDescend = totalDescend + max(0, lastAltitude - fixedAltitude);
  lastAltitude = fixedAltitude;
}

void updateMeasurements(BME280Measurements bme280Measurements) {
  short fixedAltitude = getFixedAltitude(bme280Measurements.altitude);
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

void initBME280() {
  bme280Status = bme.begin(0x76);
  Serial.println("Test 2");
  if (!bme280Status) {
    Serial.println("Could not find a valid BME280 sensor, check wiring, address, sensor ID!");
    Serial.print("SensorID was: 0x"); Serial.println(bme.sensorID(),16);
    Serial.print("        ID of 0xFF probably means a bad address, a BMP 180 or BMP 085\n");
    Serial.print("   ID of 0x56-0x58 represents a BMP 280,\n");
    Serial.print("        ID of 0x60 represents a BME 280.\n");
    Serial.print("        ID of 0x61 represents a BME 680.\n");
  }
}
