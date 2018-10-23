import React from 'react';
import { View, Slider, Text } from 'react-native';

export default function UdaciSlider({ max, unit, step, value, onChange }) {
    return (
        <View>
            <Slider 
                value={value}
                onValueChange={onChange}
                step={step}
                maximumValue={max}
                minimumValue={0}
            />

            <Text>{value}</Text>
            <Text>{unit}</Text>
        </View>
    )
}