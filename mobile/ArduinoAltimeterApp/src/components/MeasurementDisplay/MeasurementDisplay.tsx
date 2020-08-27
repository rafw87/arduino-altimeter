import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View } from 'react-native';

export type FontSize = 'big' | 'medium' | 'small';
export type Measurement =
  | 'temperature'
  | 'humidity'
  | 'pressure'
  | 'seaLevelPressure'
  | 'altitude'
  | 'minAlt'
  | 'maxAlt'
  | 'avgAlt'
  | 'descend'
  | 'ascend';
export type MeasurementDisplayProps = {
  label: string;
  measurement: Measurement;
  editable?: boolean;
  fontSize?: FontSize;
  format?: (value: number) => string;
  unit?: string;
};

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

const tmpValues: { [key in Measurement]: number } = {
  temperature: 23.1,
  humidity: 32,
  pressure: 933,
  seaLevelPressure: 1023,
  altitude: 300,
  minAlt: 300,
  maxAlt: 1836,
  avgAlt: 801,
  ascend: 1911,
  descend: 1911,
};

export const MeasurementDisplay = (props: MeasurementDisplayProps) => {
  const { label, measurement, editable = false, fontSize = 'small', unit } = props;

  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState<number | null>(tmpValues[measurement]);

  useEffect(() => {
    setValue(tmpValues[measurement]);
  }, [measurement]);

  const handleLongPress = useCallback(() => {
    setEditMode(true);
  }, [setEditMode]);

  const handleChangeText = useCallback(
    (text: string) => {
      const newValue = text !== '' ? parseInt(text) : null;
      if (!Number.isNaN(newValue)) {
        setValue(newValue);
      }
    },
    [setValue],
  );

  const handleBlur = useCallback(() => {
    setEditMode(false);
  }, [setEditMode]);

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
