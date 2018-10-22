import React from 'react';
import { View, Text } from 'react-native';
import { getMetricMetaInfo } from '../utils/helpers';

export default class AddEntry extends React.Component {
    state = {
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0
    };

    increment = (metric) => {
        const { max, step } = getMetricMetaInfo(metric);
        this.setState((_prevState) => {
            const count = _prevState[metric] + step;
            return {
                ..._prevState,
                [metric]: count > max ? max : count
            }
        });
    }

    decrement = (metric) => {
        this.setState((_prevState) => {
            const count = _prevState[metric] - getMetricMetaInfo(metric).step;
            return  {
                ..._prevState,
                [metric]: count < 0 ? 0 : count
            }
        });
    }

    slide = (metric, value) => {
        this.setState((_prevState) => ({
            [metric]: value
        }));
    }

    render() {
        return (
            <View>
                {
                    getMetricMetaInfo("bike").getIcon()
                }
            </View>
        )
    }
}