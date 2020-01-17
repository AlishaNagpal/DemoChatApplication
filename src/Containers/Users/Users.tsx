import React from 'react';
import { PureComponent } from 'react'
import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import FirebaseService from '../../utils/FirebaseService';
import styles from './styles'
import { Colors, vh, VectorIcons, Images } from '../../Constants';

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
    lastMessage: string,
    chatsDone: boolean,
    updatedData: any,
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
            lastMessage: 'No chat has occured yet',
            lastMessageSearch: [],
            chatsDone: false,
            updatedData: []
        };
    }

    componentDidMount() {
        FirebaseService.readUserData(this.getUsersData)
        FirebaseService.readInboxData(this.state.uid, this.getLastMessages)
        this.gettingDateMatch()
    }

    getUsersData = (data: any) => {
        var result = Object.keys(data).map(function (key) {
            return [String(key), data[key]];
        })

        this.setState({
            data: result
        })
        let tempArray = this.state.data
        let indexToFind = tempArray.findIndex((item: any) => item[0] === this.state.uid)
        tempArray.splice(indexToFind, 1)
    }

    getLastMessages = (data: any) => {
        var result: Array<any> = Object.keys(data).map(function (key) {
            return [String(key), data[key]];
        })
        if (result) {
            this.setState({
                lastMessageSearch: result,
                chatsDone: true
            })
            console.log(this.state.lastMessageSearch)
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

    gettingDateMatch = () => {
        let date = new Date()
        let getDay = date.getDate()
        var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        let getMonth =  months[date.getMonth()];
        console.log(date, getDay, getMonth)
    }

    renderData = (rowData: any) => {
        const { item } = rowData
        return (
            <View>
                <View style={styles.row} >
                    <TouchableOpacity style={styles.root} onPress={() => this.oneOnOneChat(item[1].otherID)} activeOpacity={1} >
                        <View style={styles.row2} >
                            <Text style={styles.nameSet} >{item[1].user.otherPersonName}</Text>
                            <Text style={styles.message2} >{item[1].createdAt}</Text>
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
        if (this.state.chatsDone) {
            console.log('this.state.updatedData', this.state.updatedData)
            return (
                <FlatList
                    data={this.state.lastMessageSearch}
                    renderItem={this.renderData}
                    keyExtractor={(item, index) => index.toString()}
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
                {this.state.lastMessageSearch &&
                    this.verifying()
                }
            </View>
        )
    }
}
