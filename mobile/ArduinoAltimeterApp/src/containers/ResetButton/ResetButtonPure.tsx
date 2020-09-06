import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Button, View } from 'react-native';
import { resetMeasurementsClickAction } from '../../store/measurements';

export type OwnProps = {};
export type StateProps = {
  clicks: number;
  remainedClicks: number;
};
export type DispatchProps = {
  resetClick: typeof resetMeasurementsClickAction;
};

type AllProps = OwnProps & StateProps & DispatchProps;

const styles = StyleSheet.create({
  root: {},
});

export const ResetButtonPure = (props: AllProps) => {
  const { clicks, remainedClicks, resetClick } = props;
  const handlePress = useCallback(() => {
    resetClick();
  }, [resetClick]);

  const label = useMemo(() => {
    if (clicks > 0) {
      return `Reset (tap another ${remainedClicks} times to confirm)`;
    } else {
      return 'Reset';
    }
  }, [clicks, remainedClicks]);

  return (
    <View style={styles.root}>
      <Button title={label} onPress={handlePress} />
    </View>
  );
};
