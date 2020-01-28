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
    chatRoomName: string,
    messages: any,
    loadEarlier: boolean,
    isLoadingEarlier: boolean,
    lastMessageKey: string,
    typingText: boolean,
    typingPerson: string,
    userName: string,
    userImage: string,
    messageLenght: number,
}

export default class MultiChat extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            uid: this.props.navigation.getParam('uid'),
            chatRoomName: this.props.navigation.getParam('chatRoomName'),
            userName: this.props.navigation.getParam('userName'),
            userImage: this.props.navigation.getParam('userImage'),
            messages: [],
            loadEarlier: false,
            isLoadingEarlier: false,
            lastMessageKey: '',
            typingText: false,
            typingPerson: '',
            messageLenght: 0,
        };
    }

    _isMounted = false

    componentDidMount() {
        this._isMounted = true
        FirebaseServices.getTypingValueForGroup(this.state.chatRoomName, this.getTyping)
        console.log('incomponent did mount ')
        FirebaseServices.getGroupMessages(this.state.chatRoomName, (message: any) => {
            function compareWhole(a: any, b: any) {
                const bandA = a.mess.createdAt;
                const bandB = b.mess.createdAt;
                let comparison = 0;
                if (bandA > bandB) {
                    comparison = 1;
                } else if (bandA < bandB) {
                    comparison = -1;
                }
                return comparison * -1;
            }
            let ans = message.sort(compareWhole)
            let data: Array<any> = []
            for (let i = 0; i < ans.length; i++) {
                let mess = ans[i].mess
                data.push(mess)
            }
            this.setState(previousState => ({
                messages: data
                // GiftedChat.append(previousState.messages, message),
            })
            )
            this.setState({
                messageLenght: this.state.messages.length
            })
            if (this.state.messageLenght === 20) {
                let getLastMessageKey = ans[19].id
                console.log('getLastMessageKey', getLastMessageKey)
                this.setState({
                    lastMessageKey: getLastMessageKey,
                    loadEarlier: true
                })
            }
        });
    }

    getTyping = (data: any) => {
        let tempArray = data._value
        let keys = Object.keys(tempArray)
        let indexToFind = keys.findIndex((item: any) => item === this.state.uid)
        keys.splice(indexToFind, 1)
        for (let i = 0; i < keys.length; i++) {
            if (tempArray[keys[i]].typing === true) {
                this.setState({
                    typingText: true,
                    typingPerson: tempArray[keys[i]]._name
                })
                break;
            } else {
                this.setState({
                    typingText: false,
                    typingPerson: ''
                })
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    get user() {
        return {
            GroupName: this.state.chatRoomName,
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
        FirebaseServices.ChangeTypingText(this.state.chatRoomName, this.state.uid, false)
        this.props.navigation.navigate('Users')
    }

    onLoadEarlier = () => {
        if (this.state.lastMessageKey) {
            this.setState({
                isLoadingEarlier: true,
            })

            setTimeout(() => {
                if (this._isMounted === true) {
                    FirebaseServices.getPreviousGroupMessages(this.state.chatRoomName, this.state.lastMessageKey, (message: Array<any>) => {
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
            FirebaseServices.ChangeTypingText(this.state.chatRoomName, this.state.uid, true)
        } else {
            FirebaseServices.ChangeTypingText(this.state.chatRoomName, this.state.uid, false)
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
        // console.log('in render function', this.state.typingText, this.state.typingPerson)
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
