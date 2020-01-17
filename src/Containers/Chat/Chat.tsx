import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import FirebaseServices from '../../utils/FirebaseService'
import { Clipboard, View, TouchableOpacity } from 'react-native';
import styles from './styles'
import Icon from 'react-native-vector-icons/Ionicons'
Icon.loadFont()

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
    otherPersonName:string
}

export default class Chat extends React.Component<Props, State> {
    static navigationOptions = {
        title: 'Chat',
    };

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
            otherPersonName:'',
        };
    }

    componentDidMount() {
        FirebaseServices.readUserData(this.getUsersData)
        FirebaseServices.refOn(this.state.RoomID, (message: any) => {
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, message),
            })
            )
        })

    }

    getUsersData = (data: any) => {
        var result = Object.keys(data).map(function (key) {
            return [String(key), data[key]];
        })
        let tempArray = result
        let indexToFind = tempArray.findIndex((item: any) => item[0] === this.state.theOtherPerson)
        this.setState({
            otherPersonName:tempArray[indexToFind][1].name
        })
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
            otherID: this.state.theOtherPerson,
            otherPersonName: this.state.otherPersonName
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
                onSend={FirebaseServices.send}
                loadEarlier={true}
                user={this.user}
                renderUsernameOnMessage={true}
                alwaysShowSend={true}
                minComposerHeight={30}
                minInputToolbarHeight={60}
                messagesContainerStyle={styles.messageStyle}
                scrollToBottom={true}
                placeholder={'Enter your message'}
                onLongPress={this.onLongPress}
            />
        );
    }
}
