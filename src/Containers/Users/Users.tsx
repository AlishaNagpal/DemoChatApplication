import React from 'react';
import { Text, View, FlatList, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native';
import FirebaseService from '../../utils/FirebaseService';
import styles from './styles'
import { Colors, vh, VectorIcons, Images } from '../../Constants';
import { Circle } from 'react-native-animated-spinkit'

export interface Props {
    navigation: any
}

interface State {
    data: Array<any>,
    name: string,
    email: string,
    avatar: string,
    uid: string,
    lastMessageSearch: Array<any>,
    chatsDone: boolean,
    updatedData: any,
    isFetching: boolean,
    runLoader: boolean,
    groupArray: Array<any>,
    bothTrue: boolean,
    GroupMessagesArray: Array<any>,
    group: Array<string>
}

export default class Users extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            data: [],
            name: this.props.navigation.getParam('name'),
            email: this.props.navigation.getParam('email'),
            uid: this.props.navigation.getParam('userId'),
            avatar: this.props.navigation.getParam('avatar'),
            lastMessageSearch: [],
            chatsDone: false,
            updatedData: [],
            isFetching: false,
            runLoader: true,
            groupArray: [],
            bothTrue: false,
            GroupMessagesArray: [],
            group: []
        };
    }

    componentDidMount() {
        FirebaseService.readUserData(this.getUsersData)
        FirebaseService.readGroupChatData(this.getGroupChatData)
    }
    onRefresh = () => {
        this.setState({ isFetching: true })
        setTimeout(() => {
            this.setState({ isFetching: false })
        }, 400);
    }

    getUsersData = (data: any) => {
        if (data) {
            var result = Object.keys(data).map(function (key) {
                return [String(key), data[key]];
            })

            this.setState({
                data: result,
            })
            let tempArray = this.state.data
            let indexToFind = tempArray.findIndex((item: any) => item[0] === this.state.uid)
            tempArray.splice(indexToFind, 1)
            //removing myself from the array
            this.setState({
                data: tempArray.splice(0)
            })
            //getting data
            setTimeout(() => {
                FirebaseService.readInboxData(this.state.uid, this.getLastMessages)
            }, 50);
        }
    }

    //getting the last messages of the one-on-one chat
    getLastMessages = (data: any) => {
        if (data) {
            var result: Array<any> = Object.keys(data).map(function (key) {
                return [String(key), data[key]];
            })
            this.setState({
                lastMessageSearch: result,
                chatsDone: true,
            })
        }
    }

    getGroupChatData = (data: any) => {
        if (data) {
            var result = Object.keys(data).map(function (key) {
                return [String(key), data[key]];
            })
            for (let i = 0; i < result.length; i++) {
                for (let j = 0; j < result[0][1].Users.length; j++) {
                    let index = result.findIndex((item: any) => item[1].Users[j] === this.state.uid)
                    if (index !== -1) {
                        this.state.group.push(result[i][0])
                    }
                }
            }
            FirebaseService.readGroupChatMessages(this.gettingGroupMessagesToInclude)
        }
    }

    gettingGroupMessagesToInclude = (data: any) => {
        if (data) {
            var result = Object.keys(data).map(function (key) {
                return [String(key), data[key]];
            })

            for (let z = 0; z < result.length; z++) {
                // let idTocheck = result[z][1]
                // let keys = Object.keys(idTocheck)
                for (let i = 0; i < this.state.group.length; i++) {
                    if (this.state.group[i] === result[z][0]) {
                        this.setState({ bothTrue: true })
                        this.GetGroupData(result[z])
                    }
                    // let n = keys[i].includes(this.state.uid)
                    // if (n) {
                    //     //if you find the key, then what?
                    //     // this.state.groupArray.push(result[z])
                    //     this.setState({ bothTrue: true })
                    //     this.GetGroupData(result[z])
                    // }
                }
            }
            FirebaseService.readLastMessageGroup(this.getGroupMessages)
        }
    }

    GetGroupData = (data: any) => {
        let tempArr = this.state.groupArray
        let indexToFind = tempArr.findIndex((item: any) => item[0] === data[0])
        if (indexToFind === -1) {
            setTimeout(() => {
                this.state.groupArray.push(data)
                this.forceUpdate()
            }, 10);
        }
    }

    getGroupMessages = (data: any) => {
        if (data) {
            var result: Array<any> = Object.keys(data).map(function (key) {
                return [String(key), data[key]];
            })
            this.setState({
                GroupMessagesArray: result
            })
        }
    }

    oneOnOneChat(uid: string) {
        //going for one on one chat
        var chatRoomId: string
        if (uid > this.state.uid) {
            chatRoomId = uid.concat(this.state.uid)
        } else {
            chatRoomId = this.state.uid.concat(uid)
        }
        let otherperson = uid
        this.props.navigation.navigate('Chat', {
            name: this.state.name,
            email: this.state.email,
            avatar: this.state.avatar,
            userId: this.state.uid,
            sendingChat: chatRoomId,
            theOtherPerson: otherperson,
            // refresh: this.refresh.bind(this)
        });
    }

    selectToChat = () => {
        this.props.navigation.navigate('SelectToChat', {
            name: this.state.name,
            email: this.state.email,
            avatar: this.state.avatar,
            userId: this.state.uid,
            data: this.state.data,
        })
    }

    goForMultiChat = (chatRoomId: string, chatRoomName: string) => {
        this.props.navigation.navigate('MultiChat', {
            uid: this.state.uid,
            chatRoomId: chatRoomId,
            chatRoomName: chatRoomName,
            userName: this.state.name,
            userImage: this.state.avatar,
        })
    }

    renderData = (rowData: any) => {
        const { item } = rowData
        return (
            <View>
                <View style={styles.row} >
                    <TouchableOpacity style={styles.root} onPress={() => this.oneOnOneChat(item[1].otherId)} activeOpacity={1} >
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

    renderGroup = (row: any) => {
        if (this.state.GroupMessagesArray.length !== 0) {
            const { item } = row
            let indexToFind = this.state.GroupMessagesArray.findIndex((value: any) => value[0] === item[0])
            const { user } = this.state.GroupMessagesArray[indexToFind][1]
            return (
                <View>
                    <View style={styles.row} >
                        <TouchableOpacity style={styles.root} onPress={() => this.goForMultiChat(user.idRoom, user.GroupName)} activeOpacity={1} >
                            <View style={styles.row2} >
                                <Text style={styles.nameSet} >{item[0]}</Text>
                                <Text style={styles.message2} >{this.state.GroupMessagesArray[indexToFind][1].gettingTime}</Text>
                            </View>
                            <View style={styles.time} >
                                <Text style={styles.message} >{this.state.GroupMessagesArray[indexToFind][1].text}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.separator} />
                </View>
            )
        }
    }

    verifying = () => {
        setTimeout(() => {
            this.setState({ runLoader: false })
        }, 800);
        // console.log('in verifying', this.state.chatsDone, this.state.updatedData, this.state.groupArray, this.state.bothTrue)
        if (this.state.chatsDone && this.state.lastMessageSearch.length !== 0 && this.state.bothTrue === false) {
            return (
                <FlatList
                    data={this.state.lastMessageSearch}
                    renderItem={this.renderData}
                    keyExtractor={(item, index) => index.toString()}
                    onRefresh={() => this.onRefresh()}
                    refreshing={this.state.isFetching}
                />
            )
        } else if (this.state.lastMessageSearch.length !== 0 && this.state.groupArray.length !== 0 && this.state.bothTrue === true) {
            return (
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={this.state.isFetching} onRefresh={this.onRefresh} />
                    }>
                    <View>
                        <FlatList
                            data={this.state.lastMessageSearch}
                            renderItem={this.renderData}
                            keyExtractor={(item, index) => index.toString()}
                            scrollEnabled={false}
                        />
                        <FlatList
                            data={this.state.groupArray}
                            renderItem={this.renderGroup}
                            keyExtractor={(item, index) => index.toString()}
                            scrollEnabled={false}
                        />
                    </View>

                </ScrollView>
            )
        } else if (this.state.groupArray.length !== 0 && this.state.bothTrue === true) {
            return (
                <View>
                    <FlatList
                        data={this.state.groupArray}
                        renderItem={this.renderGroup}
                        keyExtractor={(item, index) => index.toString()}
                        onRefresh={() => this.onRefresh()}
                        refreshing={this.state.isFetching}
                    />
                </View>
            )
        } else {
            return (
                <View style={styles.centerNoChats} >
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
