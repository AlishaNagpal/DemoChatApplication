import React from 'react';
import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
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
    groupArray: Array<any>
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
            groupArray: []
        };
    }

    componentDidMount() {
        FirebaseService.readUserData(this.getUsersData)
        // this.gettingDateMatch()
        // this.props.navigation.addListener(
        //     'didFocus',
        //     (payload: any) => {
        //         FirebaseService.readUserData(this.getUsersData)
        //         this.forceUpdate()
        //     }
        // );
        FirebaseService.readGroupChatData(this.getGroupChatData)
    }

    getGroupChatData = (data: any) => {
        if (data) {
            var result = Object.keys(data).map(function (key) {
                return [String(key), data[key]];
            })
            // console.log('getGroupChatData', result)
            for (let z = 0; z < result.length; z++) {
                let idTocheck = result[z][1]
                let keys = Object.keys(idTocheck)
                // console.log(keys)
                for (let i = 0; i < keys.length; i++) {
                    let n = keys[i].includes(this.state.uid)
                    if (n){
                        //if you find the key, then what?
                        this.state.groupArray.push(result[z])
                    }
                }
            }
            console.log(this.state.groupArray)
        }
    }

    onRefresh = () => {
        this.setState({ isFetching: true })
        FirebaseService.readUserData(this.getUsersData)
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
            this.setState({
                data: tempArray.splice(0)
            })
            setTimeout(() => {
                FirebaseService.readInboxData(this.state.uid, this.getLastMessages)
            }, 50);
        }
    }

    getLastMessages = (data: any) => {
        if (data) {
            var result: Array<any> = Object.keys(data).map(function (key) {
                return [String(key), data[key]];
            })
            this.setState({
                lastMessageSearch: result,
                chatsDone: true,
                isFetching: false
            })
            for (let i = 0; i < this.state.data.length; i++) {
                for (let j = 0; j < this.state.lastMessageSearch.length; j++) {
                    if (this.state.lastMessageSearch[j][0] === this.state.data[i][0]) {
                        this.getUpdatedData(this.state.data[i], this.state.lastMessageSearch[j])
                    }
                }
            }
        }
    }

    getUpdatedData = (data: any, lastMessage: any) => {
        let tempArr = this.state.updatedData
        let indexToFind = tempArr.findIndex((item: any) => item[0] === data[0])
        if (indexToFind === -1) {
            data[1].message = lastMessage[1].text
            data[1].time = lastMessage[1].gettingTime
            // console.log('lastMessage[1].textß', lastMessage[1].text)
            setTimeout(() => {
                this.state.updatedData.push(data)
                this.forceUpdate()
            }, 10);
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

    // gettingDateMatch = () => {
    //     let date = new Date()
    //     let getDay = date.getDate()
    //     var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    //     let getMonth = months[date.getMonth()];
    // }

    renderData = (rowData: any) => {
        const { item } = rowData
        return (
            <View>
                <View style={styles.row} >
                    <TouchableOpacity style={styles.root} onPress={() => this.oneOnOneChat(item[1].uid)} activeOpacity={1} >
                        <View style={styles.row2} >
                            <Text style={styles.nameSet} >{item[1].name}</Text>
                            <Text style={styles.message2} >{item[1].time}</Text>
                        </View>
                        <View style={styles.time} >
                            <Text style={styles.message} >{item[1].message}</Text>
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
        }, 500);
        if (this.state.chatsDone && this.state.updatedData.length !== 0) {
            return (
                <FlatList
                    data={this.state.updatedData}
                    renderItem={this.renderData}
                    keyExtractor={(item, index) => index.toString()}
                    onRefresh={() => this.onRefresh()}
                    refreshing={this.state.isFetching}
                />
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
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} >
                        <VectorIcons.Ionicons name='md-arrow-back' size={vh(30)} />
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
