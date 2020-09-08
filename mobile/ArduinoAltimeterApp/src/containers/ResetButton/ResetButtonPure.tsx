import React, { useCallback, useMemo } from 'react';
import { Button, ButtonProps, StyleSheet, View } from 'react-native';
import {
  resetMeasurementsClickAction,
  resetMeasurementsConfirmAction,
  ResetState,
} from '../../store/measurements';

export type OwnProps = {};
export type StateProps = {
  state: ResetState;
  inProgress: boolean;
  error: Error | null;
};
export type DispatchProps = {
  reset: typeof resetMeasurementsClickAction;
  confirm: typeof resetMeasurementsConfirmAction;
};

type AllProps = OwnProps & StateProps & DispatchProps;

const styles = StyleSheet.create({
  root: {},
  buttonReady: {},
  buttonInProgress: {},
  buttonSuccess: {},
  buttonError: {},
});

const getNotificationButtonProps = (inProgress: boolean, error: Error | null) => {
  if (inProgress) {
    return {
      title: 'Resetowanie...',
      disabled: true,
    };
  } else if (error) {
    return {
      color: '#ff0000',
      title: 'Błąd podczas resetowania',
    };
  } else {
    return {
      color: '#00ff00',
      title: 'Reset ukończony',
    };
  }
};

export const ResetButtonPure = (props: AllProps) => {
  const { state, inProgress, error, reset, confirm } = props;
  const handleReset = useCallback(() => {
    reset();
  }, [reset]);
  const handleConfirm = useCallback(() => {
    confirm();
  }, [confirm]);

  switch (state) {
    case ResetState.Ready:
      return (
        <View style={styles.root}>
          <Button title="Resetuj" onPress={handleReset} />
        </View>
      );
    case ResetState.WaitingForConfirmation:
      return (
        <View style={styles.root}>
          <Button title="Potwierdź" onPress={handleConfirm} />
        </View>
      );
    case ResetState.StatusNotification:
      return (
        <View style={styles.root}>
          <Button {...getNotificationButtonProps(inProgress, error)} onPress={handleReset} />
        </View>
      );
  }
};
