import React from 'react';
import { Text, View, FlatList, TouchableOpacity, Image, } from 'react-native';
import FirebaseService from '../../utils/FirebaseService';
import styles from './styles'
import { Colors, vh, VectorIcons, Images } from '../../Constants';
import { Circle } from 'react-native-animated-spinkit'
import { setData } from '../../Modules/Chat/ChatAction'
import { connect } from 'react-redux'

export interface Props {
    navigation: any,
    setData: Function,
    chatData: Array<any>
}

interface State {
    name: string,
    email: string,
    avatar: string,
    uid: string,
    chatsDone: boolean,
    updatedData: any,
    isFetching: boolean,
    runLoader: boolean,
    group: Array<string>
}

class Users extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            name: this.props.navigation.getParam('name'),
            email: this.props.navigation.getParam('email'),
            uid: this.props.navigation.getParam('userId'),
            avatar: this.props.navigation.getParam('avatar'),
            chatsDone: false,
            updatedData: [],
            isFetching: false,
            runLoader: true,
            group: [],
        };
    }

    onRefresh = () => {
        this.setState({ isFetching: true })
        setTimeout(() => {
            this.setState({ isFetching: false })
        }, 400);
    }

    //going to the next page for chat
    selectToChat = () => {
        this.props.navigation.navigate('SelectToChat', {
            name: this.state.name,
            email: this.state.email,
            avatar: this.state.avatar,
            userId: this.state.uid,
        })
    }

    componentDidMount() {
        console.log('uid', this.state.uid)
        FirebaseService.readInboxData(this.state.uid, this.getLastMessages)
        FirebaseService.readGroupChatData(this.getGroupChatData)
    }

    //getting the last messages of the one-on-one chat
    getLastMessages = (data: any) => {
        if (data) {
            var result: Array<any> = Object.keys(data).map(function (key) {
                return [String(key), data[key]];
            })
            for (let i = 0; i < result.length; i++) {
                this.props.setData(result[i])
            }
            this.setState({
                chatsDone: true,
            })
            FirebaseService.readGroupChatData(this.getGroupChatData)
        }
    }

    //just getting the group users, if the group is to be included here or not 
    getGroupChatData = (data: any) => {
        if (data) {
            this.setState({
                chatsDone: true,
            })
            var result = Object.keys(data).map(function (key) {
                return [String(key), data[key]];
            })
            for (let i = 0; i < result.length; i++) {
                for (let j = 0; j < result[i][1].Users.length; j++) {
                    if (result[i][1].Users[j] === this.state.uid) {
                        console.log('checkinbg', result[i][1].Users[j], this.state.uid)
                        this.GetGroupData(result[i][0])
                    }
                }
            }
            FirebaseService.readLastMessageGroup(this.getGroupMessages)
        }
    }

    //relevant messages to be showed
    GetGroupData = (data: any) => {
        let tempArr = this.state.group
        let indexToFind = tempArr.findIndex((item: any) => item === data)
        if (indexToFind === -1) {
            this.state.group.push(data)
        }
    }

    //last inbox messages
    getGroupMessages = (data: any) => {
        if (data) {
            var result: Array<any> = Object.keys(data).map(function (key) {
                return [String(key), data[key]];
            })
            for (let i = 0; i < this.state.group.length; i++) {
                for (let j = 0; j < result.length; j++) {
                    if (this.state.group[i] === result[j][0]) {
                        this.props.setData(result[j])
                    }
                }
            }
        }
    }

    onChat(value: string, type: number) {
        if (type === 0) {
            //going for one on one chat
            var chatRoomId: string
            if (value > this.state.uid) {
                chatRoomId = value.concat(this.state.uid)
            } else {
                chatRoomId = this.state.uid.concat(value)
            }
            let otherperson = value
            this.props.navigation.navigate('Chat', {
                name: this.state.name,
                email: this.state.email,
                avatar: this.state.avatar,
                userId: this.state.uid,
                sendingChat: chatRoomId,
                theOtherPerson: otherperson,
                // refresh: this.refresh.bind(this)
            });
        } else if (type === 1) {
            this.props.navigation.navigate('MultiChat', {
                uid: this.state.uid,
                chatRoomName: value,
                userName: this.state.name,
                userImage: this.state.avatar,
            })
        }
    }

    renderData = (rowData: any) => {
        const { item } = rowData
        let num = 0
        if (item[1].otherName === item[1].otherId) {
            num = 1
        }
        return (
            <View>
                <View style={styles.row} >
                    <TouchableOpacity style={styles.root} onPress={() => this.onChat(item[1].otherId, num)} activeOpacity={1} >
                        <View style={styles.row2} >
                            <Text style={styles.nameSet} >{item[1].otherName}</Text>
                            <Text style={styles.message2} >{item[1].gettingTime}</Text>
                        </View>
                        <View style={styles.time} >
                            <Text style={styles.message} >{item[1].text}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.separator} />
            </View>
        )
    }

    verifying = () => {
        setTimeout(() => {
            this.setState({ runLoader: false })
        }, 1000);
        if (this.state.chatsDone && this.props.chatData.length !== 0) {
            return (
                <FlatList
                    data={this.props.chatData}
                    renderItem={this.renderData}
                    keyExtractor={(item, index) => index.toString()}
                    onRefresh={() => this.onRefresh()}
                    refreshing={this.state.isFetching}
                />
            )
        } else {
            return (
                <View style={styles.centerNoChats}>
                    <Image
                        source={Images.noChat}
                        style={styles.noChatImage}
                    />
                    <Text style={styles.noChat} >No Chats</Text>
                </View>
            )
        }
    }

    render() {
        return (
            <View style={styles.main} >
                <View style={styles.iconView} >
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} style={styles.signOutTop} >
                        <Text style={styles.signOut} >Sign Out</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addMessage} onPress={() => this.selectToChat()} >
                        <VectorIcons.MaterialCommunityIcons name='message-plus' size={vh(30)} color={Colors.shembe} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.chats} >Chats</Text>
                {this.verifying()}
                {this.state.runLoader &&
                    <View style={styles.loader} >
                        <Circle size={250} color={Colors.shembe} />
                    </View>
                }
            </View>
        )
    }
}


function mapDispatchToProps(dispatch: Function) {
    return {
        setData: (value: any) => dispatch(setData(value))
    }
}

function mapStateToProps(state: any) {
    const { chatData } = state.ChatMessagesReducer;
    return {
        chatData
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Users);
