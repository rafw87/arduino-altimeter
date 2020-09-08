
#ifndef NANO_33_BLE_EEPROM_24AA01_H
#define NANO_33_BLE_EEPROM_24AA01_H

#define PAGE_SIZE 8
#define EEPROM_ADDR 0b1010000

#include <Arduino.h>

class EEPROM {
public:
    int init();

    int read(uint8_t address, uint8_t *data, uint8_t size);

    int write(uint8_t address, uint8_t *data, uint8_t size);

    template<typename T>
    T read(uint8_t address);


    template<typename T>
    void write(uint8_t address, T value);

    int getLastResult() const;

private:
    int lastResult = 0;
};

template<typename T>
T EEPROM::read(uint8_t address) {
    T value;
    memset(&value, 0, sizeof(value));
    read(address, (uint8_t * ) & value, sizeof(value));
    return value;
}

template<typename T>
void EEPROM::write(uint8_t address, T value) {
    write(address, (uint8_t * ) & value, sizeof(value));
}

#endif //NANO_33_BLE_EEPROM_24AA01_H
