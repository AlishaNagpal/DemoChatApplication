import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import FirebaseServices from '../../utils/FirebaseService'
import { Clipboard, TouchableOpacity, View, Text, Image } from 'react-native';
import styles from './styles'
import { Colors, vh, VectorIcons, Images } from "../../Constants";
import { Bubble, Composer, Day, InputToolbar } from '../../Components'


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
    otherPersonName: string,
    loadEarlier: boolean,
    isLoadingEarlier: boolean,
    typingText: any,
    lastMessageKey: string
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
            otherPersonName: '',
            typingText: null,
            loadEarlier: true,
            isLoadingEarlier: false,
            lastMessageKey: ''
        };
    }

    _isMounted = false

    componentDidMount() {
        this._isMounted = true
        FirebaseServices.readUserData(this.getUsersData)
        FirebaseServices.refOn(this.state.RoomID, (message: any) => {
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, message),
            })
            )
            // console.log(this.state.messages)
            let lenght = this.state.messages.length
            let getLastMessageKey = this.state.messages[lenght - 1].id
            this.setState({
                lastMessageKey: getLastMessageKey
            })
        })
    }

    getUsersData = (data: any) => {
        var result = Object.keys(data).map(function (key) {
            return [String(key), data[key]];
        })
        let tempArray = result
        let indexToFind = tempArray.findIndex((item: any) => item[0] === this.state.theOtherPerson)
        this.setState({
            otherPersonName: tempArray[indexToFind][1].name
        })
    }

    componentWillUnmount() {
        FirebaseServices.refOff()
        this._isMounted = false
    }

    goBack = () => {
        // this.props.navigation.state.params.refresh()
        this.props.navigation.navigate('Users')
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

    onLoadEarlier = () => {
        this.setState(() => {
            return {
                isLoadingEarlier: true,
            }
        })
        console.log(this.state.lastMessageKey)

        setTimeout(() => {
            if (this._isMounted === true) {
                FirebaseServices.getPreviousMessages(this.state.RoomID, this.state.lastMessageKey, (message: Array<any>) => {
                    console.log('setTimeoutal', message)
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

    render() {
        return (
            <View style={styles.main} >
                <TouchableOpacity style={styles.headerView} activeOpacity={1} onPress={this.goBack} >
                    <VectorIcons.Ionicons name={'md-arrow-back'} size={vh(30)} style={styles.icon} />
                    <Text style={styles.nameText} >{this.state.otherPersonName}</Text>
                </TouchableOpacity>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={FirebaseServices.send}
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
