#define BATTERY_LEVEL A7
#define BATTERY_EMPTY_READING 310
#define BATTERY_FULL_READING 615
#define ALTITUDE_HISTERESIS 0.2f

#include <ArduinoBLE.h>
#include <Adafruit_BME280.h>

struct BME280Measurements {
  float temperature;
  float humidity;
  float pressure;
  float altitude;
};

Adafruit_BME280 bme;

BLEService batteryService("180F");
//BLEService environmentalService("181A");
BLEService altimeterService("470405e3-d3b7-42d4-a359-ef34241b55a1");
BLEByteCharacteristic batteryLevelChar("2101", BLERead | BLENotify);
BLEIntCharacteristic altitudeChar("2AB3", BLERead | BLEWrite | BLENotify);

short lastAltitude;
short minAltitude;
short maxAltitude;
float avgAltitude;
short totalAscend;
short totalDescend;
int counter;


float seaLevelPressure = 1013.25;
unsigned bme280Status;

void setup() {
  pinMode(BATTERY_LEVEL, INPUT);
  
  Serial.begin(115200);

  initBME280();
  BME280Measurements bme280Measurements;
  getBME280MeasurementsTwice(&bme280Measurements);
  resetMeasurements(bme280Measurements);

  while (!BLE.begin()) {
    Serial.println("starting BLE failed!");
    delay(1000);
  }
  BLE.setLocalName("Arduino Altimeter");
  BLE.setAdvertisedService(batteryService);
  batteryService.addCharacteristic(batteryLevelChar);
  BLE.addService(batteryService);
  BLE.setAdvertisedService(altimeterService);
  altitudeChar.setEventHandler(BLEWritten, updateAltitude);
  altimeterService.addCharacteristic(altitudeChar);
  BLE.addService(altimeterService);
  BLE.advertise();
  Serial.println("Bluetooth device active, waiting for connections...");
}

void loop() {
  BME280Measurements bme280Measurements;
  getBME280MeasurementsTwice(&bme280Measurements);
  calculateMeasurements(bme280Measurements);
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

  
  BLEDevice central = BLE.central();
  if (central && central.connected()) {
    batteryLevelChar.writeValue(round(batteryLevel));
    altitudeChar.writeValue(lastAltitude * 100);
  }
  delay(500);
}


void updateAltitude(BLEDevice central, BLECharacteristic characteristic) {
  int value = altitudeChar.value();
  short newAltitude = value / 100;
  Serial.print("Updated altitude, written: ");
  Serial.print(value);
  Serial.print(", altitude: ");
  Serial.println(newAltitude);
  seaLevelPressure = bme.seaLevelForAltitude(newAltitude, bme.readPressure() * 0.01f);
  BME280Measurements bme280Measurements;
  getBME280MeasurementsTwice(&bme280Measurements);
  updateMeasurements(bme280Measurements);
}

bool getBME280Measurements(BME280Measurements *measurements) {
  float temperature = bme.readTemperature();
  float humidity = bme.readHumidity();
  float pressure = bme.readPressure();
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
