/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { AltitudeDisplay } from './components/AltitudeDisplay';
import { MeasurementDisplay } from './components/MeasurementDisplay/MeasurementDisplay';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <AltitudeDisplay />
            </View>
            <View style={styles.sectionContainerFlex}>
              <MeasurementDisplay label="Min. wysokość" measurement="minAlt" />
              <MeasurementDisplay label="Maks. wysokość" measurement="maxAlt" />
              <MeasurementDisplay label="Średnia wysokość" measurement="avgAlt" />
              <MeasurementDisplay label="W górę" measurement="ascend" />
              <MeasurementDisplay label="W dół" measurement="descend" />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
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
  },
});

export default App;
