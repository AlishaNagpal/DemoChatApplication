import React from 'react';
import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import FirebaseService from '../../utils/FirebaseService';
import styles from './styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Colors, vh } from '../../Constants';
Ionicons.loadFont()

export interface Props {
    navigation: any
}

interface State {
    data: any,
    name: string,
    email: string,
    avatar: string,
    uid: string,
    lastMessageSearch: any,
    lastMessage: string,
    showSelected: boolean,
    arr: any,
}

export default class Users extends React.Component<Props, State> {

    static navigationOptions = {
        title: 'Users'
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            data: null,
            lastMessageSearch: null,
            name: this.props.navigation.getParam('name'),
            email: this.props.navigation.getParam('email'),
            uid: this.props.navigation.getParam('userId'),
            avatar: this.props.navigation.getParam('avatar'),
            lastMessage: 'No chat has occured yet',
            showSelected: false,
            arr: []
        };
    }

    componentDidMount() {
        FirebaseService.readUserData(this.getUsersData)
        FirebaseService.readInboxData(this.getLastMessages)
        this.forceUpdate()
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
        var result = Object.keys(data).map(function (key) {
            return [String(key), data[key]];
        })
        this.setState({
            lastMessageSearch: result
        })
        let tempArray = this.state.lastMessageSearch
        let indexToFind = tempArray.findIndex((item: any) => item[0] === this.state.uid)
        let chatRoomToFind = tempArray[indexToFind]
        this.setState({
            lastMessageSearch: chatRoomToFind[1]
        })
        for (let i = 0; i < this.state.data.length; i++) {
            let message = this.state.lastMessageSearch
            let keys = Object.keys(message)
            let uidTocheck = keys[i]
            // FirebaseService.changeLastSeenMessage(message[uidTocheck].text, uidTocheck, message[uidTocheck].createdAt)
            for (let j = 0; j < this.state.data.length; j++) {
                if (keys[i] === this.state.data[j][0]) {
                    this.state.data[j][1].message = message[uidTocheck].text
                    this.state.data[j][1].time = message[uidTocheck].createdAt
                }
            }
        }
    }

    groupChat = () => {
        this.props.navigation.navigate('GroupChat', {
            name: this.state.name,
            email: this.state.email,
            avatar: this.state.avatar,
            userId: this.state.uid,
        });
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

    getUnique = (array: any) => {
        var uniqueArray = [];

        // Loop through array values
        for (let i = 0; i < array.length; i++) {
            if (uniqueArray.indexOf(array[i]) === -1) {
                uniqueArray.push(array[i]);
            }
        }
        return uniqueArray;
    }

    longPress = (uid: string, value: boolean) => {
        for (let i = 0; i < this.state.data.length; i++) {
            if (uid === this.state.data[i][0]) {
                this.state.data[i][1].selected = !value
                this.setState({
                    showSelected: !value
                })
            }
        }
        this.state.arr.push(uid)
        let values = this.getUnique(this.state.arr)
        console.log(values)
        if (value === false) {
            this.setState({
                arr: []
            })
        } //logic issue
    }

    renderData = (rowData: any) => {
        const { item } = rowData
        return (
            <TouchableOpacity onLongPress={() => this.longPress(item[1].uid, item[1].selected)} style={styles.root} onPress={() => this.oneOnOneChat(item[1].uid)} activeOpacity={1} >
                {/* <Image
                    style={styles.image}
                    source={{ uri: item[1].image }}
                /> */}
                {item[1].selected && this.state.showSelected &&
                    <Ionicons name='md-checkbox-outline' color={Colors.rosa} size={vh(30)} />
                }
                <View style={styles.lastMessage} >
                    <Text style={styles.nameSet} >{item[1].name}</Text>
                    <Text style={styles.message} >{item[1].message}</Text>
                </View>
                <View style={styles.time} >
                    <Ionicons name='ios-chatbubbles' color={Colors.chatBlue} size={vh(30)} />
                    <Text style={styles.message} >{item[1].time}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.main} >
                <TouchableOpacity style={styles.button} onPress={this.groupChat} activeOpacity={1} >
                    {/* <Image
                        style={styles.image}
                        source={{ uri: this.state.avatar }}
                    /> */}
                    <Text ellipsizeMode={'tail'} style={styles.buttonText} > Group Chat {this.state.name}? </Text>
                </TouchableOpacity>
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderData}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}
