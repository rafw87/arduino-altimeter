import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
  },
  label: {
    fontSize: 10,
    color: '#808080',
  },
  value: {
    fontSize: 32,
    fontWeight: '400',
    color: '#000000',
  },
});

export type Measurement = 'minAlt' | 'maxAlt' | 'avgAlt' | 'descend' | 'ascend';
const tmpValues: { [key in Measurement]: number } = {
  minAlt: 300,
  maxAlt: 1836,
  avgAlt: 801,
  ascend: 1911,
  descend: 1911,
};

export type MeasurementDisplayProps = {
  label: string;
  measurement: Measurement;
};

export const MeasurementDisplay = (props: MeasurementDisplayProps) => {
  const { label, measurement } = props;
  const value = tmpValues[measurement];

  return (
    <View style={styles.root}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};
