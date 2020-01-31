import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import FirebaseServices from '../../utils/FirebaseService'
import { Clipboard, TouchableOpacity, View, Text, Image, ActivityIndicator, FlatList } from 'react-native';
import styles from './styles'
import { Colors, vh, VectorIcons, Images } from "../../Constants";
import { Bubble, Composer, Day, InputToolbar } from '../../Components'
import { connect } from 'react-redux'
import moment from 'moment'


export interface Props {
    navigation?: any,
    mediaMessage: Array<any>,
    renderFooter: boolean,
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
    typingText: boolean,
    lastMessageKey: string,
    lengthMessage: number
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

class Chat extends React.Component<Props, State> {
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
            typingText: false,
            loadEarlier: false,
            isLoadingEarlier: false,
            lastMessageKey: '',
            lengthMessage: 0,
        };
    }

    _isMounted = false

    componentDidMount() {
        this._isMounted = true
        FirebaseServices.readUserData(this.getUsersData)
        FirebaseServices.getTypingValue(this.state.RoomID, this.state.theOtherPerson, this.getTyping)
        FirebaseServices.refOn(this.state.RoomID, (message: any) => {
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
                lengthMessage: this.state.messages.length
            })
            if (this.state.lengthMessage === 20) {
                let getLastMessageKey = ans[19].id
                this.setState({
                    lastMessageKey: getLastMessageKey,
                    loadEarlier: true
                })
            }
        })
    }
    getTyping = (data: any) => {
        if (data._value) {
            this.setState({
                typingText: true
            })
        } else {
            this.setState({
                typingText: false
            })
        }
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
        // FirebaseServices.refOff()
        this._isMounted = false
    }

    goBack = () => {
        // this.props.navigation.state.params.refresh()
        // this.props.navigation.navigate('Users')
        this.props.navigation.pop(2)
        FirebaseServices.ChangeTypingText(this.state.RoomID, this.state.uid, false)
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
        if (this.state.lastMessageKey) {
            this.setState(() => {
                return {
                    isLoadingEarlier: true,
                }
            })

            setTimeout(() => {
                if (this._isMounted === true) {
                    FirebaseServices.getPreviousMessages(this.state.RoomID, this.state.lastMessageKey, (message: Array<any>) => {
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
        this.setState({
            messages: this.state.messages.splice(0)
        })
    }

    renderData = (rowDATA: any) => {
        const { item } = rowDATA
        var dated = moment()
            .utcOffset('+05:30')
            .format(' hh:mm a');
        console.log('renderData item', item)
        return (
            <View style={styles.footerView} >
                <Image
                    source={{ uri: item.fileURL }}
                    style={styles.footerImage}
                />
                <Text style={styles.timeStyle} >{dated}</Text>
                <ActivityIndicator size='large' style={styles.indicator} color={Colors.white} />
            </View>
        )
    }

    renderFooter = (prop: any) => {
        console.log(' renderFooter', this.props.mediaMessage, this.props.renderFooter)
        if (this.props.renderFooter) {
            let array = this.props.mediaMessage.filter((item:any)=>item.chatRoomId === this.state.RoomID && item.senderId === this.state.uid);
           
            // let index = array.findIndex((item: any) => item.chatRoomId === this.state.RoomID && item.senderId === this.state.uid)
            // array.push(this.props.mediaMessage[index])
            console.log('renderFooter',array)
            return (
                <FlatList
                    data={array}
                    keyExtractor={(item, index) => (item + index).toString()}
                    renderItem={this.renderData}
                />
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

    ontextChanged = (val: string) => {
        if (val !== '') {
            FirebaseServices.ChangeTypingText(this.state.RoomID, this.state.uid, true)
        } else {
            FirebaseServices.ChangeTypingText(this.state.RoomID, this.state.uid, false)
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
            <InputToolbar {...props} reRenderMessages={() => this.reRenderMessages()} />
        )
    }

    get user() {
        return {
            name: this.state.name,
            avatar: this.state.avatar,
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
                    <Image
                        source={Images.ProfileImage}
                        style={styles.imageStyle}
                    />
                    <View>
                        <Text style={styles.nameText} >{this.state.otherPersonName}</Text>
                        <Text style={styles.typingText} >{this.state.typingText ? 'typing...' : ''}</Text>
                    </View>
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
                    onInputTextChanged={(val) => this.ontextChanged(val)} //changes over here
                    messagesContainerStyle={styles.messagesContainerStyle}
                    ref={(ref) => this.inputText = ref}
                    renderDay={this.renderDay}
                    renderInputToolbar={this.renderInputToolbar}
                    minComposerHeight={vh(45)}
                    maxComposerHeight={vh(80)}
                    renderFooter={this.renderFooter}
                />
            </View>
        );
    }
}

function mapStateToProps(state: any) {
    const { mediaMessage, renderFooter } = state.MediaMessagesReducer;
    return {
        mediaMessage,
        renderFooter,
    }
}

export default connect(
    mapStateToProps,
)(Chat);
