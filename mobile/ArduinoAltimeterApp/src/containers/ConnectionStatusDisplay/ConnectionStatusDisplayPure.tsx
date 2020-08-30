import React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import { ConnectionStatus } from '../../store/connection';

export type OwnProps = {};
export type StateProps = {
  status: ConnectionStatus;
};
export type DispatchProps = {};

type AllProps = OwnProps & StateProps & DispatchProps;

const commonLabelStyle: TextStyle = {
  fontSize: 20,
  textAlign: 'center',
  marginBottom: 5,
};

const styles = StyleSheet.create({
  root: {},
  labelDisconnected: {
    ...commonLabelStyle,
    color: '#ff0000',
  },
  labelConnecting: {
    ...commonLabelStyle,
    color: '#ff8000',
  },
  labelConnected: {
    ...commonLabelStyle,
    color: '#00ff00',
  },
});

const getStatusElement = (status: ConnectionStatus) => {
  switch (status) {
    case ConnectionStatus.Disconnected:
      return <Text style={styles.labelDisconnected}>Disconnected</Text>;
    case ConnectionStatus.Connecting:
      return <Text style={styles.labelConnecting}>Connecting...</Text>;
    case ConnectionStatus.Connected:
      return <Text style={styles.labelConnected}>Connected</Text>;
  }
};

export const ConnectionStatusDisplayPure = (props: AllProps) => {
  const { status } = props;
  return <View style={styles.root}>{getStatusElement(status)}</View>;
};
