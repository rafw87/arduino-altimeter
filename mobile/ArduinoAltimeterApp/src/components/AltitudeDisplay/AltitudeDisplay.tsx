import React, { useCallback, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput, TextStyle,
} from 'react-native';

const commonStyles: TextStyle = {
    height: 100,
    fontSize: 60,
    textAlign: 'center',
    fontWeight: '600',
    color: '#000000',
}

const styles = StyleSheet.create({
    text: {
        ...commonStyles,
        lineHeight: commonStyles.height as number,
    },
    textInput: {
        ...commonStyles
    },
});

const formatAltitude = (altitude: number | null) => {
    if(altitude == null) {
        return '?';
    }
    return `${altitude}m`
}

export const AltitudeDisplay = () => {
    const [editMode, setEditMode] = useState(false);
    const [value, setValue] = useState<number | null>(null);

    const handleLongPress = useCallback(() => {
        setEditMode(true);
    }, [setEditMode]);

    const handleChangeText = useCallback((text: string) => {
        const newValue = text !== '' ? parseInt(text) : null;
        if(!Number.isNaN(newValue)) {
            setValue(newValue);
        }
    }, [setValue]);

    const handleBlur = useCallback(() => {
        setEditMode(false);
    }, [setEditMode]);

    if(editMode) {
        return (
            <TextInput
                style={styles.textInput}
                keyboardType = 'numeric'
                autoFocus
                value={value?.toString() ?? ''}
                onChangeText={handleChangeText}
                onBlur={handleBlur}
            />
        )
    } else {
        return (
            <TouchableOpacity onLongPress={handleLongPress}>
                <Text style={styles.text}>{formatAltitude(value)}</Text>
            </TouchableOpacity>
        )
    }


};
