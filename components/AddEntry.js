import React from 'react';
import { View, TouchableOpacity, Text, Platform, StyleSheet} from 'react-native';
import { getMetricMetaInfo, timeToString } from '../utils/helpers';
import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciSteppers';
import DateHeader from './DateHeader';
import { Ionicons } from '@expo/vector-icons';
import TextButton from './TextButton';
import { submitEntry, removeEntry } from '../utils/api';
import { connect } from 'react-redux';
import { addEntry } from '../actions';
import { getDailyReminderValue } from '../utils/helpers';
import { white, purple } from '../utils/colors';

function submitBtn(onPress) {
    return (
        <TouchableOpacity 
        style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
        onPress={onPress}>
            <Text style={styles.submitBtn}>Submit</Text>
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
        const { dispatch } = this.props;
        removeEntry(key);
        dispatch(addEntry({
            [key]: getDailyReminderValue()
        }));
        // Navigate to home
    }

    render() {
        const metrics = getMetricMetaInfo();
        
        if (this.props.alreadyLogged) {
            return (
                <View style={styles.center}>
                    <Ionicons 
                        name={Platform.OS === 'ios' ? 'ios-happy' : 'md-happy'}
                        size={100}
                    />
                    <Text>You already logged your information for today.</Text>
                    <TextButton onPress={this.reset}></TextButton>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <DateHeader date={(new Date().toLocaleDateString())}></DateHeader>
                {
                    Object.keys(metrics).map((_key) => {
                       const { getIcon, type, ...rest } = metrics[_key];
                       const value = this.state[_key]

                       return (
                           <View key={_key} style={styles.row}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: white
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    iosSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        borderRadius: 7,
        height: 45,
        marginLeft: 40,
        marginRight: 40,
    },
    androidSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        height: 45,
        borderRadius: 2,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center'
    },
    submitBtn: {
        color: white,
        fontSize: 22,
        textAlign: 'center'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 30
    }
})

const mapStateToProps = (state) => {
    const key = timeToString();

    return {
        alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    }
}
export default connect(mapStateToProps)(AddEntry);