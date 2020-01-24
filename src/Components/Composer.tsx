import React from 'react';
import { Composer } from 'react-native-gifted-chat';
import { Colors, vw, Strings, vh } from "../Constants";


export interface Props {
    props: any
}

interface State {
}

export default class ComposerClass extends React.Component<Props, State> {

    render() {
        return (
            <Composer
                {...this.props}
                placeholder={Strings.typeMsg}
                textInputStyle={{
                    fontSize: vh(15),
                    height: vh(45),
                    margin: vw(10),
                    alignSelf: 'center',
                    borderRadius: vh(5),
                    alignItems: 'center',
                    backgroundColor: Colors.white,
                    paddingTop: vw(10),
                    paddingLeft: vw(10),
                    paddingRight: vw(10),
                    paddingBottom: vw(10)
                }}
            />
        )
    }
}
