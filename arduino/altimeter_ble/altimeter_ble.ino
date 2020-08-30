#define BATTERY_LEVEL A7
#define BATTERY_EMPTY_READING 310
#define BATTERY_FULL_READING 615

#include <Adafruit_BME280.h>

Adafruit_BME280 bme;

float seaLevelPressure = 1013.25;
unsigned bme280Status;
float initialAltitude = 0;
float initialBatteryLevel = 0;

void setup() {
  pinMode(BATTERY_LEVEL, INPUT);
  
  Serial.begin(115200);

  initBME280();
  initialAltitude = getAltitude();
  initialBatteryLevel = getBatteryLevel();
  Serial.println("Altitude Battery");
}

void loop() {
  if (bme280Status) {
    float altitude = bme.readAltitude(seaLevelPressure);
    if(isnan(altitude)) {
      Serial.println("BME280 is disconnected.");
      initBME280();
      return;
    }
    float batteryLevel = getBatteryLevel();

    Serial.print(altitude);
    Serial.print(" ");
    Serial.print(batteryLevel);
    Serial.println();
    
  } else {
    Serial.println("BME280 is disconnected.");
  }
  delay(500);
}

float getAltitude() {
  bool isDisconnected;
  return getAltitude(&isDisconnected);
}

float getAltitude(bool *isConnected) {
  float altitude = bme.readAltitude(seaLevelPressure);
  if(isnan(altitude)) {
    *isConnected = false;
    return 0;
  } else {
    *isConnected = true;
    return altitude;
  }
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
