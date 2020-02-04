import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import FirebaseServices from '../../utils/FirebaseService'
import { Clipboard, TouchableOpacity, View, Text, Image, ActivityIndicator } from 'react-native';
import { Colors, vh, VectorIcons, Images, vw } from "../../Constants";
import styles from './styles'
import { Bubble, Composer, Day, InputToolbar } from '../../Components'
import { connect } from 'react-redux'
import moment from 'moment'
import { ArrayLenght } from '../../Modules/MediaMessage/MediaMessageAction'

export interface Props {
    navigation?: any,
    mediaMessage: Array<any>,
    renderFooter: boolean,
    ArrayLenght: Function,
    lengthArray: number
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
    showFooter: boolean
}

function compare(a: any, b: any) {
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
class MultiChat extends React.Component<Props, State> {

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
            showFooter: false
        };
    }

    _isMounted = false

    componentDidMount() {
        this._isMounted = true
        this.reRenderMessages()
        FirebaseServices.getTypingValueForGroup(this.state.chatRoomName, this.getTyping)
        FirebaseServices.getGroupMessages(this.state.chatRoomName, (message: any) => {
            let ans = message.sort(compare)
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
        // this.props.navigation.navigate('Users')
        this.props.navigation.pop(2)
    }

    onLoadEarlier = () => {
        if (this.state.lastMessageKey) {
            this.setState({
                isLoadingEarlier: true,
            })

            setTimeout(() => {
                if (this._isMounted === true) {
                    FirebaseServices.getPreviousGroupMessages(this.state.chatRoomName, this.state.lastMessageKey, (message: Array<any>) => {
                        let sorted = message.sort(compare)
                        sorted.splice(0, 1)
                        let data: Array<any> = []
                        for (let i = 0; i < sorted.length; i++) {
                            let mess = sorted[i].mess
                            data.push(mess)
                        }
                        if (sorted.length === 19) {
                            let getLastMessageKey = sorted[18].id
                            this.setState({
                                loadEarlier: true,
                                lastMessageKey: getLastMessageKey,
                            })
                        } else {
                            this.setState({ loadEarlier: false, })
                        }

                        this.setState(previousState => ({
                            messages: [...this.state.messages, ...data],
                            isLoadingEarlier: false,
                        }))
                    })
                }
            }, 1000)
        }
    }

    reRenderMessages = () => {
        let array = this.props.mediaMessage.filter((item: any) => item.chatRoomId === this.state.chatRoomName && item.senderId === this.state.uid);
        if (array.length !== 0) {
            this.props.ArrayLenght(array.length)
            this.setState({
                showFooter: true,
                messages: this.state.messages.splice(0)
            })
        } else {
            this.setState({
                showFooter: false
            })
        }
    }

    renderFooter = (prop: any) => {
        var dated = moment()
            .utcOffset('+05:30')
            .format(' hh:mm a');
        if (this.props.renderFooter && this.state.showFooter) {
            let array = this.props.mediaMessage.filter((item: any) => item.chatRoomId === this.state.chatRoomName && item.senderId === this.state.uid);
            return (
                <View style={styles.footerView} >
                    <Image
                        source={{ uri: array[0].fileURL }}
                        style={styles.footerImage}
                    />
                    <Text style={styles.timeStyle} >{dated}</Text>
                    <Text style={styles.arrayText} >{this.props.lengthArray}</Text>
                    <ActivityIndicator size='large' style={styles.indicator} color={Colors.white} />
                </View>
            )
        } else {
            return null
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

    renderMessageVideo = (props: any) => {
        console.log('props', props, props.currentMessage.video)
        return (
            <Video
                source={{ uri: props.currentMessage.video }}   // Can be a URL or a local file.
                ref={(ref) => {
                    this.player = ref
                }}                                      // Store reference
                // onBuffer={this.onBuffer}                // Callback when remote video is buffering
                // onError={this.videoError}               // Callback when video cannot be loaded
                style={styles.backgroundVideo}
            />
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
            <InputToolbar {...props} reRenderMessages={() => this.reRenderMessages()} type={'Group'} />
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
                    minComposerHeight={vw(45)}
                    maxComposerHeight={vw(60)}
                    //@ts-ignore
                    renderFooter={this.renderFooter}
                    renderMessageVideo={this.renderMessageVideo}
                />
            </View>
        );
    }
}


function mapDispatchToProps(dispatch: Function) {
    return {
        ArrayLenght: (value: number) => dispatch(ArrayLenght(value))
    }
}

function mapStateToProps(state: any) {
    const { mediaMessage, renderFooter, lengthArray } = state.MediaMessagesReducer;
    return {
        mediaMessage,
        renderFooter,
        lengthArray
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MultiChat);

