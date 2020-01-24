import React from 'react';
import { Bubble } from 'react-native-gifted-chat';
import { Colors, vw } from "../Constants";


export interface Props {
    props: any
}

interface State {
}

export default class Chat extends React.Component<Props, State> {

    render() {
        return (
            <Bubble
                {...this.props}
                //@ts-ignore
                wrapperStyle={{
                    left: {
                        backgroundColor: Colors.white,
                        borderRadius: vw(0),
                        borderBottomEndRadius: vw(10),
                        borderBottomLeftRadius: vw(10),
                        borderTopRightRadius: vw(10)
                    },
                    right: {
                        backgroundColor: Colors.chatBubble,
                        borderRadius: vw(0),
                        borderBottomEndRadius: vw(10),
                        borderBottomLeftRadius: vw(10),
                        borderTopLeftRadius: vw(10)
                    }
                }}
            />
        );
    }
}
