/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { ConnectionStatusDisplay, MeasurementDisplay } from './containers';
import { RealBluetoothService } from './services';
import { createAppStore } from './store/createStore';
import { Measurement } from './types';

const store = createAppStore({ bluetoothService: new RealBluetoothService() });

const App = () => {
  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          <View style={styles.body}>
            <ConnectionStatusDisplay />
            <View style={styles.sectionContainer}>
              <MeasurementDisplay
                label="Wysokość"
                measurement={Measurement.altitude}
                fontSize="big"
                unit="m"
                editable
              />
            </View>
            <View style={styles.sectionContainer}>
              <MeasurementDisplay
                label="Ciśnienie na p. morza"
                measurement={Measurement.seaLevelPressure}
                fontSize="medium"
                unit="hPa"
                editable
              />
            </View>
            <View style={styles.sectionContainerFlex}>
              <MeasurementDisplay
                label="Temperatura"
                measurement={Measurement.temperature}
                unit="°C"
              />
              <MeasurementDisplay label="Wilgotność" measurement={Measurement.humidity} unit="%" />
              <MeasurementDisplay label="Ciśnienie" measurement={Measurement.pressure} unit="hPa" />
            </View>
            <View style={styles.sectionContainerFlex}>
              <MeasurementDisplay label="Min. wysokość" measurement={Measurement.minAlt} unit="m" />
              <MeasurementDisplay
                label="Maks. wysokość"
                measurement={Measurement.maxAlt}
                unit="m"
              />
              <MeasurementDisplay
                label="Średnia wysokość"
                measurement={Measurement.avgAlt}
                unit="m"
              />
              <MeasurementDisplay label="W górę" measurement={Measurement.ascend} unit="m" />
              <MeasurementDisplay label="W dół" measurement={Measurement.descend} unit="m" />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    minHeight: '100%',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {},
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionContainerFlex: {
    marginTop: 32,
    paddingHorizontal: 24,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
  },
});

export default App;
