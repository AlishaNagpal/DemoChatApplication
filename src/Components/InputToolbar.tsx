import React from 'react';
import { InputToolbar } from 'react-native-gifted-chat';
import { vh } from "../Constants";


export interface Props {
    props: any
}

interface State {
}

export default class InputToolbarClass extends React.Component<Props, State> {

    render() {
        return (
            <InputToolbar
                {...this.props}
                containerStyle={{
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    paddingRight: vh(7.5),
                    alignItems: 'center',
                    justifyContent: 'center',
                    // height: vh(55),
                }}
                primaryStyle={{ alignItems: 'center' }}
            />
        )
    }
}
