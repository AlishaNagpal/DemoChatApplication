import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import FirebaseServices from '../../utils/FirebaseService'
import { Clipboard, View, Text } from 'react-native';

export interface Props {
    navigation?: any,
}

interface State {
    uid: string,
    chatRoomId: string,
    chatRoomName: string,
    messages: any,
}

export default class MultiChat extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            uid: this.props.navigation.getParam('uid'),
            chatRoomId: this.props.navigation.getParam('chatRoomId'),
            chatRoomName: this.props.navigation.getParam('chatRoomName'),
            messages: [],

        };
    }

    componentDidMount() {
        // let id = this.state.uid + '-' + this.state.chatPerson
        FirebaseServices.getGroupMessages(this.state.chatRoomName,this.state.chatRoomId, (message: any) => {
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

    get user() {
        return {
            name: this.state.chatRoomName,
            idRoom: this.state.chatRoomId,
            _id: this.state.uid,
        };
    }

    onLongPress = (context: any, message: any) => {
        const options = ['Copy', 'Delete Message', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        context.actionSheet().showActionSheetWithOptions({
            options,
            cancelButtonIndex
        }, (buttonIndex: any) => {
            switch (buttonIndex) {
                case 0:
                    Clipboard.setString(message.text);
                    break;
                case 1:
                    //code to delete
                    break;
            }
        });
    }
    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={FirebaseServices.sendMultiChat}
                loadEarlier={true}
                user={this.user}
                renderUsernameOnMessage={true}
                alwaysShowSend={true}
                minComposerHeight={30}
                minInputToolbarHeight={60}
                messagesContainerStyle={{ backgroundColor: 'white' }}
                scrollToBottom={true}
                placeholder={'Enter your message'}
                onLongPress={this.onLongPress}
            />
        );
    }
}
