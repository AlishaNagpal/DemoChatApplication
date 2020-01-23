import React from 'react';
import { GiftedChat, Bubble, Composer, Day } from 'react-native-gifted-chat';
import FirebaseServices from '../../utils/FirebaseService'
import { Clipboard, TouchableOpacity, View, Text, Image } from 'react-native';
import { Colors, vh, vw, VectorIcons, Strings, Images } from "../../Constants";
import styles from './styles'

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
    renderBubble = (props: any) => {
        return (
            <Bubble
                {...props}
                //@ts-ignore
                wrapperStyle={{
                    left: {
                        backgroundColor: Colors.white,
                        borderRadius: vw(0),
                        borderBottomEndRadius: vw(10),
                        borderBottomLeftRadius: vw(10),
                        borderTopRightRadius: vw(10)
                    },
                    right: {
                        backgroundColor: Colors.chatBubble,
                        borderRadius: vw(0),
                        borderBottomEndRadius: vw(10),
                        borderBottomLeftRadius: vw(10),
                        borderTopLeftRadius: vw(10)
                    }
                }}
            />
        );
    }

    goBack = () => {
        // this.props.navigation.state.params.refresh()
        this.props.navigation.navigate('Users')
    }

    onLoadEarlier = () => {
        this.setState({
            isLoadingEarlier: true,
        })

        // setTimeout(() => {
        //     if (this._isMounted === true) {
        //         FirebaseServices.getPreviousMessages(this.state.RoomID, (message: any) => {
        //             console.log(message)
        //             this.setState(previousState => ({
        //                 messages: GiftedChat.prepend(previousState.messages, message),
        //                 loadEarlier: false,
        //                 isLoadingEarlier: false,
        //             })
        //             )
        //         })
        //     }
        // }, 1000) // simulating network //simply repeating things over here 
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

    renderComposer = (props: any) => {
        return (
            <Composer
                {...props}
                composerHeight={vh(30)}
                placeholder={Strings.typeMsg}
                textInputStyle={styles.inputText}
                multiline={true}
            />
        )
    }

    renderDay = (props: any) => {
        // console.log('props', props)
        return (
            <Day
                {...props}
                wrapperStyle={styles.Day}
                //@ts-ignore
                currentMessage={{
                    createdAt: props.currentMessage.createdAt
                }}
                textStyle={styles.dayText}
            />
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
                    loadEarlier={true}
                    user={this.user}
                    renderUsernameOnMessage={true}
                    alwaysShowSend={true}
                    minComposerHeight={30}
                    minInputToolbarHeight={60}
                    scrollToBottom={true}
                    placeholder={'Enter your message'}
                    onLongPress={this.onLongPress}
                    renderBubble={this.renderBubble}
                    timeTextStyle={{ left: { color: Colors.leftTimeText }, right: { color: Colors.white } }}
                    renderSend={this.renderSend}
                    renderComposer={this.renderComposer}
                    messagesContainerStyle={styles.messagesContainerStyle}
                    ref={(ref) => this.inputText = ref}
                    renderDay={this.renderDay}
                />
            </View>
        );
    }
}
