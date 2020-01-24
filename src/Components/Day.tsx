import React from 'react';
import { Day } from 'react-native-gifted-chat';
import { Colors, vw, vh } from "../Constants";


export interface Props {
    props: any
}

interface State {
}

export default class DayClass extends React.Component<Props, State> {

    render() {
        return (
            <Day
                {...this.props}
                
                wrapperStyle={{
                    backgroundColor: Colors.day,
                    paddingVertical: vh(8),
                    paddingHorizontal: vw(13),
                    borderRadius: vh(5)
                }}
                //@ts-ignore
                currentMessage={{
                    createdAt: this.props.currentMessage.createdAt
                }}
                textStyle={{color: Colors.dayText}}
            />
        )
    }
}
