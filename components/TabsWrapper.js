import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';

const Hello = () => (
    <View>
        <Text>Hello!</Text>
    </View>
);

const Goodbye = () => (
    <View>
        <Text>Goodbye!</Text>
    </View>
);
const Tabs = createBottomTabNavigator({
    Hello: {
        screen: Hello
    },
    Goodbye: {
        screen: Goodbye
    }
});

export default class TabsWrapper extends React.Component {
    render() {
        return (
            <Tabs></Tabs>
        );
    }
}