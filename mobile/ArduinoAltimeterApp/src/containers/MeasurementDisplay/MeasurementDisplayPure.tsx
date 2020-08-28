import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View } from 'react-native';
import {
  saveMeasurementAction,
  setMeasurementEditModeAction,
  updateMeasurementDraftValueAction,
} from '../../store/measurements';
import { Measurement } from '../../types';

export type FontSize = 'big' | 'medium' | 'small';

export type OwnProps = {
  label: string;
  measurement: Measurement;
  editable?: boolean;
  fontSize?: FontSize;
  format?: (value: number) => string;
  unit?: string;
};

export type StateProps = {
  value: number | null;
  editMode: boolean;
};

export type DispatchProps = {
  updateDraft: typeof updateMeasurementDraftValueAction;
  saveMeasurement: typeof saveMeasurementAction.request;
  setEditMode: typeof setMeasurementEditModeAction;
};

type AllProps = OwnProps & StateProps & DispatchProps;

const fontSizes: { [key in FontSize]: number } = {
  big: 80,
  medium: 60,
  small: 28,
};

const getCommonStyles = (fontSize: FontSize): TextStyle => ({
  fontSize: fontSizes[fontSize],
  height: fontSizes[fontSize],
  lineHeight: fontSizes[fontSize],
  textAlign: 'center',
  fontWeight: '600',
  color: '#000000',
});

const getStyles = (fontSize: FontSize) => {
  const commonStyles = getCommonStyles(fontSize);
  return StyleSheet.create({
    root: {
      display: 'flex',
      flexDirection: 'column',
      margin: 10,
    },
    label: {
      fontSize: 10,
      textAlign: 'center',
      color: '#808080',
      marginBottom: 5,
    },
    valueContainer: {
      alignSelf: 'center',
      flexDirection: 'row',
    },
    value: {
      ...commonStyles,
      lineHeight: commonStyles.height as number,
    },
    unit: {
      ...commonStyles,
      fontSize: (commonStyles?.fontSize ?? 0) / 2,
      lineHeight: commonStyles.height as number,
      color: '#404040',
    },
    editor: {
      ...commonStyles,
      padding: 0,
      textAlignVertical: 'top',
    },
  });
};

export const MeasurementDisplayPure = (props: AllProps) => {
  const {
    label,
    measurement,
    editable = false,
    fontSize = 'small',
    unit,
    value,
    editMode,
    setEditMode,
    saveMeasurement,
    updateDraft,
  } = props;

  const handleLongPress = useCallback(() => {
    setEditMode({ measurement, editMode: true });
  }, [setEditMode, measurement]);

  const handleChangeText = useCallback(
    (text: string) => {
      const newValue = text !== '' ? parseInt(text) : null;
      if (!Number.isNaN(newValue)) {
        updateDraft({ measurement, value: newValue });
      }
    },
    [updateDraft, measurement],
  );

  const handleBlur = useCallback(() => {
    if (value != null) {
      saveMeasurement({ measurement, value });
    }
    setEditMode({ measurement, editMode: false });
  }, [setEditMode, saveMeasurement, measurement, value]);

  const styles = useMemo(() => getStyles(fontSize), [fontSize]);
  if (!editable) {
    return (
      <View style={styles.root}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value != null ? value : '?'}</Text>
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </View>
      </View>
    );
  }
  if (editMode) {
    return (
      <View style={styles.root}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueContainer}>
          <TextInput
            style={styles.editor}
            keyboardType="numeric"
            autoFocus
            value={value?.toString() ?? ''}
            onChangeText={handleChangeText}
            onBlur={handleBlur}
          />
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.root}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueContainer}>
          <TouchableOpacity onLongPress={handleLongPress}>
            <Text style={styles.value}>{value != null ? value : '?'}</Text>
          </TouchableOpacity>
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </View>
      </View>
    );
  }
};
