import React from 'react';
import { GiftedChat, Bubble, Composer, Day } from 'react-native-gifted-chat';
import FirebaseServices from '../../utils/FirebaseService'
import { Clipboard, TouchableOpacity, View, Text, Image } from 'react-native';
import styles from './styles'
import { Colors, vh, vw, VectorIcons, Strings, Images } from "../../Constants";


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
    typingText: any,
    isLoadingEarlier: boolean,
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
            loadEarlier: true,
            typingText: null,
            isLoadingEarlier: false,
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
        this.setState(() => {
            return {
                isLoadingEarlier: true,
            }
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
            <View style={{ flex: 1 }} >
                <TouchableOpacity style={styles.headerView} activeOpacity={1} onPress={this.goBack} >
                    <VectorIcons.Ionicons name={'md-arrow-back'} size={vh(30)} style={styles.icon} />
                    <Text style={styles.nameText} >{this.state.otherPersonName}</Text>
                </TouchableOpacity>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={FirebaseServices.send}
                    user={this.user}
                    loadEarlier={this.state.loadEarlier}
                    onLoadEarlier={this.onLoadEarlier}
                    isLoadingEarlier={this.state.isLoadingEarlier}
                    renderAvatarOnTop={true}
                    alwaysShowSend={true}
                    showAvatarForEveryMessage={false}
                    showUserAvatar={true}
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
