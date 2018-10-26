import React from 'react';
import { View, TouchableOpacity, Text} from 'react-native';
import { getMetricMetaInfo, timeToString } from '../utils/helpers';
import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciSteppers';
import DateHeader from './DateHeader';
import { Ionicons } from '@expo/vector-icons';
import TextButton from './TextButton';
import { submitEntry, removeEntry } from '../utils/api';
import { connect } from 'react-redux';
import { addEntry } from '../actions';

function submitBtn(onPress) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Text>Submit</Text>
        </TouchableOpacity>
    );
}

class AddEntry extends React.Component {
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

    submit = () => {
        const key = timeToString();
        const entry = this.state;
        this.setState((_state) => ({
            run: 0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat: 0
        }));
        // Update redux
        const { dispatch } = this.props;
        dispatch(addEntry({
            [key]: entry
        }));
        // Navigate to home
        // Save data to database
        submitEntry({key, entry});
        // clear local notification
    }

    reset = () => {
        const key = timeToString();
        removeEntry(key);
        // Update redux
        // Navigate to home
        // Save data to database
    }

    render() {
        const metrics = getMetricMetaInfo();
        
        if (this.props.alreadyLogged) {
            return (
                <View>
                    <Ionicons 
                        name='ios-happy' 
                        size={100}
                    />
                    <Text>You already logged your information for today.</Text>
                    // Reset button
                    <TextButton onPress={this.reset} />
                </View>
            )
        }

        return (
            <View>
                <DateHeader date={(new Date().toLocaleDateString())}></DateHeader>
                {
                    Object.keys(metrics).map((_key) => {
                       const { getIcon, type, ...rest } = metrics[_key];
                       const value = this.state[_key]

                       return (
                           <View key={_key}>
                                { getIcon() }
                                {
                                    type === 'slider' 
                                        ? <UdaciSlider value={value} onChange={(_value) => this.slide(_key, _value)} { ...rest } />
                                        : <UdaciSteppers value={value} onIncrement={() => this.increment(_key)} onDecrement={() => this.decrement(_key)}  {...rest} />
                                }
                           </View>
                       )
                   })
                }

                {submitBtn(this.submit)}
            </View>
        )
    }
}
export default connect()(AddEntry);