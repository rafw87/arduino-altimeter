#ifndef _BLE_NUMERIC_CHARACTERISTIC_H_
#define _BLE_NUMERIC_CHARACTERISTIC_H_

#include <ArduinoBLE.h>

template<typename T>
class BLENumericCharacteristic : public BLECharacteristic {
public:
    BLENumericCharacteristic(const char *uuid, unsigned char properties,
                             int8_t multiplier, int8_t decimalExponent, int8_t binaryExponent);

    int writeValue(float value);

    int writeValue();

    void setValue(float value);

    float value(void);

private:
    float currentValue;
    int8_t multiplier;
    int8_t decimalExponent;
    int8_t binaryExponent;
};

template<typename T>
BLENumericCharacteristic<T>::BLENumericCharacteristic(const char *uuid, unsigned char properties,
                                                      int8_t multiplier, int8_t decimalExponent, int8_t binaryExponent)
        : BLECharacteristic(uuid, properties, sizeof(T), false), currentValue(0), multiplier(multiplier),
          decimalExponent(decimalExponent), binaryExponent(binaryExponent) {

}

template<typename T>
int BLENumericCharacteristic<T>::writeValue() {
    T transformedValue = round(currentValue / multiplier / pow(10, decimalExponent) / pow(2, binaryExponent));
    return BLECharacteristic::writeValue(transformedValue);
}

template<typename T>
int BLENumericCharacteristic<T>::writeValue(float value) {
    setValue(value);
    return writeValue();
}

template<typename T>
void BLENumericCharacteristic<T>::setValue(float value) {
    currentValue = value;
}

template<typename T>
float BLENumericCharacteristic<T>::value() {
    T rawValue;
    memcpy(&rawValue, (unsigned char *) BLECharacteristic::value(), min(BLECharacteristic::valueSize(), sizeof(T)));

    return rawValue * multiplier * pow(10.0f, decimalExponent) / pow(2.0f, binaryExponent);
}


#endif
