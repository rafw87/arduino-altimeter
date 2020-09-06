#include "EEPROM.h"

#include <Wire.h>

int EEPROM::init() {
    Wire.begin();
    Wire.beginTransmission(EEPROM_ADDR);
    Wire.write(0x00);
    lastResult = Wire.endTransmission();
    return lastResult;
}

int EEPROM::read(uint8_t address, uint8_t *data, uint8_t size) {
    Wire.beginTransmission(EEPROM_ADDR);
    Wire.write(address);
    byte r = Wire.endTransmission();
    if (r) {
        lastResult = r;
        return 0;
    }
    Wire.requestFrom(EEPROM_ADDR, size);
    int available = min(Wire.available(), size);
    for (int i = 0; i < available; i++) {
        data[i] = Wire.read();
    }
    lastResult = 0;
    return available;
}

int EEPROM::write(uint8_t address, uint8_t *data, uint8_t size) {
    uint8_t offset = 0;

    while (offset < size) {
        uint8_t currAddress = address + offset;
        uint8_t page = (currAddress / PAGE_SIZE);
        uint8_t pageEnd = page * PAGE_SIZE + PAGE_SIZE; // exclusive
        Wire.beginTransmission(EEPROM_ADDR);
        Wire.write(currAddress);
        uint8_t pageLen = min(pageEnd - currAddress, size - offset);
        Wire.write(data + offset, pageLen);
        int r = Wire.endTransmission();
        if (r) {
            lastResult = r;
            return offset;
        }
        delay(30);
        offset += pageLen;
    }
    lastResult = 0;
    return size;
}

int EEPROM::getLastResult() {
    return lastResult;
}