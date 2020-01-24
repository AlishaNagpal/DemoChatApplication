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
    typingText: boolean,
    typingPerson: string,
    userName: string,
    userImage: string
}

export default class MultiChat extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            uid: this.props.navigation.getParam('uid'),
            chatRoomId: this.props.navigation.getParam('chatRoomId'),
            chatRoomName: this.props.navigation.getParam('chatRoomName'),
            userName: this.props.navigation.getParam('userName'),
            userImage: this.props.navigation.getParam('userImage'),
            messages: [],
            loadEarlier: true,
            isLoadingEarlier: false,
            lastMessageKey: '',
            typingText: false,
            typingPerson: '',
        };
    }

    _isMounted = false

    componentDidMount() {
        // let id = this.state.uid + '-' + this.state.chatPerson
        console.log(this.state.chatRoomName)
        this._isMounted = true
        FirebaseServices.readUserData(this.getUsersData)
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

    getUsersData = (data: any) => {
        var result = Object.keys(data).map(function (key) {
            return [String(key), data[key]];
        })

        let tempArray = result
        let indexToFind = tempArray.findIndex((item: any) => item[0] === this.state.uid)
        tempArray.splice(indexToFind, 1)

        let participants = []
        for (let i = 0; i < tempArray.length; i++) {
            let id = tempArray[i][0]
            let n = this.state.chatRoomId.includes(id)
            if (n) {
                participants.push(tempArray[i])
            }
        }

        console.log('participants', participants)

        for (let i = 0; i < participants.length; i++) {
            if (participants[i][1].typing) {
                this.setState({
                    typingText: true,
                    typingPerson: participants[i][1].name
                })
            } else {
                this.setState({
                    typingText: false,
                    typingPerson: ''
                })
            }
        }
    }

    componentWillUnmount() {
        FirebaseServices.refOff()
        this._isMounted = false
    }

    get user() {
        return {
            GroupName: this.state.chatRoomName,
            idRoom: this.state.chatRoomId,
            _id: this.state.uid,
            name: this.state.userName,
            avatar: this.state.userImage,
        }
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

    ontextChanged = (val: string) => {
        if (val !== '') {
            FirebaseServices.ChangeTypingText(this.state.uid, true)
        } else {
            FirebaseServices.ChangeTypingText(this.state.uid, false)
        }
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
                    <Image
                        source={Images.groupImage}
                        style={styles.imageStyle}
                    />
                    <View>
                        <Text style={styles.nameText} >{this.state.chatRoomName}</Text>
                        <Text style={styles.typingText} >{this.state.typingText ? this.state.typingPerson + ' typing...' : ''}</Text>
                    </View>

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
                    showAvatarForEveryMessage={false}
                    showUserAvatar={true}
                    placeholder={'Enter your message'}
                    scrollToBottom={true}
                    onLongPress={this.onLongPress}
                    renderBubble={this.renderBubble}
                    timeTextStyle={{ left: { color: Colors.leftTimeText }, right: { color: Colors.white } }}
                    renderSend={this.renderSend}
                    renderComposer={this.renderComposer}
                    onInputTextChanged={(val) => this.ontextChanged(val)} //changes over here
                    messagesContainerStyle={styles.messagesContainerStyle}
                    ref={(ref) => this.inputText = ref}
                    renderDay={this.renderDay}
                    renderInputToolbar={this.renderInputToolbar}
                    minComposerHeight={vh(45)}
                    maxComposerHeight={vh(60)}
                />
            </View>
        );
    }
}
