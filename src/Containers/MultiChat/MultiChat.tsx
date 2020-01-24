import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import FirebaseServices from '../../utils/FirebaseService'
import { Clipboard, TouchableOpacity, View, Text, Image } from 'react-native';
import { Colors, vh, VectorIcons, Images } from "../../Constants";
import styles from './styles'
import { Bubble, Composer, Day, InputToolbar } from '../../Components'

export interface Props {
    navigation?: any,
}

interface State {
    uid: string,
    chatRoomId: string,
    chatRoomName: string,
    messages: any,
    loadEarlier: boolean,
    isLoadingEarlier: boolean,
    lastMessageKey: string,
}

export default class MultiChat extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            uid: this.props.navigation.getParam('uid'),
            chatRoomId: this.props.navigation.getParam('chatRoomId'),
            chatRoomName: this.props.navigation.getParam('chatRoomName'),
            messages: [],
            loadEarlier: true,
            isLoadingEarlier: false,
            lastMessageKey: ''
        };
    }

    _isMounted = false

    componentDidMount() {
        // let id = this.state.uid + '-' + this.state.chatPerson
        this._isMounted = true
        FirebaseServices.getGroupMessages(this.state.chatRoomName, this.state.chatRoomId, (message: any) => {
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, message),
            })
            )
            let lenght = this.state.messages.length
            let getLastMessageKey = this.state.messages[lenght - 1].id
            this.setState({
                lastMessageKey: getLastMessageKey
            })
        }
        );
    }

    componentWillUnmount() {
        FirebaseServices.refOff()
        this._isMounted = false
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

    goBack = () => {
        // this.props.navigation.state.params.refresh()
        this.props.navigation.navigate('Users')
    }

    onLoadEarlier = () => {
        this.setState({
            isLoadingEarlier: true,
        })

        setTimeout(() => {
            if (this._isMounted === true) {
                FirebaseServices.getPreviousGroupMessages(this.state.chatRoomName, this.state.chatRoomId, this.state.lastMessageKey, (message: Array<any>) => {
                    this.setState(previousState => ({
                        messages: [...this.state.messages, ...message],
                        loadEarlier: false,
                        isLoadingEarlier: false,
                    })
                    )
                })
            }
        }, 1000)
    }

    renderSend = (props: any) => {
        const message = this.inputText.state.text || '';
        return (
            <View style={styles.sendView}>
                <TouchableOpacity style={styles.sendBtn} activeOpacity={1} onPress={() => {
                    if (message.trim().length > 0) {
                        this.inputText.onSend(
                            {
                                text: message.trim()
                            },
                            true
                        );
                    } else {
                        return;
                    }
                }}>
                    <Image source={Images.send} />
                </TouchableOpacity>
            </View>
        )
    }

    renderBubble = (props: any) => {
        return (
            <Bubble {...props} />
        );
    }

    renderComposer = (props: any) => {
        return (
            <Composer {...props} />
        )
    }

    renderDay = (props: any) => {
        return (
            <Day {...props} />
        )
    }

    renderInputToolbar = (props: any) => {
        return (
            <InputToolbar {...props} />
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }} >
                <TouchableOpacity style={styles.headerView} activeOpacity={1} onPress={this.goBack} >
                    <VectorIcons.Ionicons name={'md-arrow-back'} size={vh(30)} style={styles.icon} />
                    <Text style={styles.nameText} >{this.state.chatRoomName}</Text>
                </TouchableOpacity>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={FirebaseServices.sendMultiChat}
                    loadEarlier={this.state.loadEarlier}
                    onLoadEarlier={this.onLoadEarlier}
                    isLoadingEarlier={this.state.isLoadingEarlier}
                    user={this.user}
                    renderAvatarOnTop={true}
                    alwaysShowSend={true}
                    renderUsernameOnMessage={true}
                    showAvatarForEveryMessage={false}
                    showUserAvatar={true}
                    placeholder={'Enter your message'}
                    scrollToBottom={true}
                    onLongPress={this.onLongPress}
                    renderBubble={this.renderBubble}
                    timeTextStyle={{ left: { color: Colors.leftTimeText }, right: { color: Colors.white } }}
                    renderSend={this.renderSend}
                    renderComposer={this.renderComposer}
                    onInputTextChanged={(val) => console.log(val)} //changes over here
                    messagesContainerStyle={styles.messagesContainerStyle}
                    ref={(ref) => this.inputText = ref}
                    renderDay={this.renderDay}
                    renderInputToolbar={this.renderInputToolbar}
                    minComposerHeight={vh(45)}
                    maxComposerHeight={vh(80)}
                />
            </View>
        );
    }
}
