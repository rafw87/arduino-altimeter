
#ifndef NANO_33_BLE_EEPROM_24AA01_H
#define NANO_33_BLE_EEPROM_24AA01_H

#define MEMORY_SIZE 128
#define PAGE_SIZE 8
#define EEPROM_ADDR 0b1010000

#include <Arduino.h>

class EEPROM {
public:
    int init();

    int read(uint8_t address, uint8_t *data, uint8_t size);

    int write(uint8_t address, uint8_t *data, uint8_t size);

    template<typename T>
    int read(uint8_t address, T &value);

    template<typename T>
    int write(uint8_t address, const T &value);

    int factoryReset();

    int getLastResult() const;

private:
    int lastResult = 0;
};

template<typename T>
int EEPROM::read(uint8_t address, T &value) {
    read(address, (uint8_t *) &value, sizeof(value));
    return lastResult;
}

template<typename T>
int EEPROM::write(uint8_t address, const T &value) {
    write(address, (uint8_t *) &value, sizeof(value));
    return lastResult;
}

#endif //NANO_33_BLE_EEPROM_24AA01_H
