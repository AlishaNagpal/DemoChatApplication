import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import FirebaseServices from '../../utils/FirebaseService'
import { Button, Text, View } from 'react-native';
import styles from './styles'

export interface Props {
    navigation?: any,
}

interface State {
    uid: string,
    email: string,
    messages: any,
    avatar: string,
    name: string,
    chatPerson:string
}

export default class Chat extends React.Component<Props, State> {

    static navigationOptions =({ navigation }) => {
        title: navigation.getParam('name')
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            uid: this.props.navigation.getParam('userId'),
            email: this.props.navigation.getParam('email'),
            name: this.props.navigation.getParam('name'),
            avatar: this.props.navigation.getParam('avatar'),
            chatPerson:this.props.navigation.getParam('sendingChat'),
            messages: [],
        };
    }

    componentDidMount() {
        let id = this.state.uid + '-' + this.state.chatPerson
        FirebaseServices.refOn(id,(message: any) => {
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, message),
            })
            )
        }
        );
    }

    componentWillUnmount() {
        FirebaseServices.refOff()
    }

    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={FirebaseServices.send}
                showUserAvatar={true}
                loadEarlier={true}
                user={{
                    _id: this.state.uid + '-' + this.state.chatPerson,
                    name: this.state.name,
                    avatar: this.state.avatar,
                }}
            />
        );
    }
}
