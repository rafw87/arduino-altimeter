/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar } from 'react-native';

import { MeasurementDisplay } from './containers';
import { createAppStore } from './store/createStore';
import { Provider } from 'react-redux';
import { EmulatedService } from './services';

const store = createAppStore({ bluetoothService: new EmulatedService() });

const App = () => {
  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <MeasurementDisplay
                label="Wysokość"
                measurement="altitude"
                fontSize="big"
                unit="m"
                editable
              />
            </View>
            <View style={styles.sectionContainer}>
              <MeasurementDisplay
                label="Ciśnienie na p. morza"
                measurement="seaLevelPressure"
                fontSize="medium"
                unit="hPa"
                editable
              />
            </View>
            <View style={styles.sectionContainerFlex}>
              <MeasurementDisplay label="Temperatura" measurement="temperature" unit="°C" />
              <MeasurementDisplay label="Wilgotność" measurement="humidity" unit="%" />
              <MeasurementDisplay label="Ciśnienie" measurement="pressure" unit="hPa" />
            </View>
            <View style={styles.sectionContainerFlex}>
              <MeasurementDisplay label="Min. wysokość" measurement="minAlt" unit="m" />
              <MeasurementDisplay label="Maks. wysokość" measurement="maxAlt" unit="m" />
              <MeasurementDisplay label="Średnia wysokość" measurement="avgAlt" unit="m" />
              <MeasurementDisplay label="W górę" measurement="ascend" unit="m" />
              <MeasurementDisplay label="W dół" measurement="descend" unit="m" />
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
