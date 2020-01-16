import React from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import FirebaseService from '../../utils/FirebaseService';
import styles from './styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Colors, vh } from '../../Constants';
Ionicons.loadFont()
MaterialCommunityIcons.loadFont()
import { CheckBox } from '../../Components'

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
        title: 'Users',
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
        this.gettingData()
    }

    refresh = () => {
        this.gettingData()
    }

    gettingData = () => {
        FirebaseService.readUserData(this.getUsersData)
        FirebaseService.readInboxData(this.getLastMessages)
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
        this.forceUpdate()
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
            sendingFunc: this.gettingData.bind(this)
        });
    }

    createGroup = () => {
        console.log('lets create a group')
        this.props.navigation.navigate('MultipleChat', {
            selectedID: this.state.arr,
            personalID: this.state.uid
        })
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
        if (value === false) {
            let tempArray = this.state.arr
            let indexToFind = tempArray.findIndex((item: any) => item === uid)
            tempArray.splice(indexToFind, 1)
            this.setState({
                arr: tempArray
            })
        } else {
            this.state.arr.push(uid)
        }
    }

    multipleToSelect = (value: boolean) => {
        this.setState({
            showSelected: value
        })
    }

    renderData = (rowData: any) => {
        const { item } = rowData
        return (
            <View>
                <View style={styles.row} >
                    {this.state.showSelected &&
                        <CheckBox id={item[1].uid} style={styles.checkbox} outerSize={vh(20)} innerSize={vh(16)} innerColor={Colors.rosa} outerColor={Colors.fadedGray} isCheck={item[1].selected} clicked={(id: string, value: boolean) => this.longPress(id, value)} />
                    }
                    <TouchableOpacity style={styles.root} onPress={() => this.oneOnOneChat(item[1].uid)} activeOpacity={1} >
                        <View style={styles.row2} >
                            <Text style={styles.nameSet} >{item[1].name}</Text>
                            <Ionicons name='ios-chatbubbles' color={Colors.chatBlue} size={vh(30)} style={styles.icon} />
                        </View>
                        <View style={styles.time} >
                            <Text style={styles.message} >{item[1].message}</Text>
                            <Text style={styles.message2} >{item[1].time}</Text>
                        </View>
                    </TouchableOpacity>


                </View>
                <View style={styles.separator} />
            </View>

        )
    }

    render() {
        return (
            <View style={styles.main} >
                <View style={styles.row} >
                    <TouchableOpacity style={styles.button} onPress={this.groupChat} activeOpacity={1} >
                        <Text ellipsizeMode={'tail'} style={styles.buttonText} > Group Chat {this.state.name}? </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.multipleAccount} onPress={() => this.multipleToSelect(!this.state.showSelected)} >
                        <MaterialCommunityIcons name='account-group-outline' color={Colors.darkishViolet} size={vh(35)} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={this.state.data}
                    renderItem={this.renderData}
                    keyExtractor={(item, index) => index.toString()}
                />
                {this.state.showSelected &&
                    <TouchableOpacity style={styles.buttonText2} onPress={this.createGroup} activeOpacity={1} >
                        <Text ellipsizeMode={'tail'} style={styles.buttonText} > Finish Creating Your Group > </Text>
                    </TouchableOpacity>
                }
                {!this.state.showSelected &&
                    <TouchableOpacity style={styles.buttonText2} onPress={this.refresh} activeOpacity={1} >
                        <Text ellipsizeMode={'tail'} style={styles.buttonText} > Refresh </Text>
                    </TouchableOpacity>
                }
            </View>
        )
    }
}
