import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import FirebaseServices from '../../utils/FirebaseService'
import { Clipboard, View, Text } from 'react-native';

export interface Props {
    navigation?: any,
}

interface State {
    uid: string,
    email: string,
    messages: any,
    avatar: string,
    name: string,
    RoomID: string,
    theOtherPerson: string,
}

export default class MultiChat extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            uid: this.props.navigation.getParam('userId'),
            email: this.props.navigation.getParam('email'),
            name: this.props.navigation.getParam('name'),
            avatar: this.props.navigation.getParam('avatar'),
            RoomID: this.props.navigation.getParam('sendingChat'),
            theOtherPerson: this.props.navigation.getParam('theOtherPerson'),
            messages: [],
        };
    }

    componentDidMount() {
        // let id = this.state.uid + '-' + this.state.chatPerson
        FirebaseServices.refOn(this.state.RoomID, (message: any) => {
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
            name: this.state.name,
            avatar: this.state.avatar,
            email: this.state.email,
            idRoom: this.state.RoomID,
            _id: this.state.uid,
            otherID: this.state.theOtherPerson
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
                messagesContainerStyle={{backgroundColor:'white'}}
                scrollToBottom={true}
                placeholder={'Enter your message'}
                onLongPress={this.onLongPress}
            />
        );
    }
}
