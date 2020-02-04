import React from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import styles from './styles'
import { Colors, vh, VectorIcons } from '../../Constants';
import { CheckBox } from '../../Components'
import LinearGradient from 'react-native-linear-gradient';
const colors = [Colors.shembe, Colors.weirdGreen]
import FirebaseService from '../../utils/FirebaseService'

export interface Props {
    navigation: any
}

interface State {
    data: Array<any>,
    name: string,
    email: string,
    uid: string,
    avatar: string,
    showSelected: boolean,
    arr: any,
}

export default class SelectToChat extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            data: [],
            name: this.props.navigation.getParam('name'),
            email: this.props.navigation.getParam('email'),
            uid: this.props.navigation.getParam('userId'),
            avatar: this.props.navigation.getParam('avatar'),
            showSelected: false,
            arr: [],
        };
    }

    componentDidMount() {
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
            //removing myself from the array
            this.setState({
                data: tempArray.splice(0)
            })
        }
    }

    oneOnOneChat(uid: string, otherName: string) {
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
            otherName: otherName,
            avatar: this.state.avatar,
            userId: this.state.uid,
            sendingChat: chatRoomId,
            theOtherPerson: otherperson
        });
    }

    createGroup = () => {
        this.props.navigation.navigate('MultipleChat', {
            selectedID: this.state.arr,
            personalID: this.state.uid,
            userName: this.state.name,
            userImage: this.state.avatar,
        })
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

    renderData = () => {
        return this.state.data.map((item) => {
            return (
                <View>
                    <View style={styles.row} >
                        {this.state.showSelected &&
                            <CheckBox id={item[1].uid} style={styles.checkbox} outerSize={vh(20)} innerSize={vh(16)} innerColor={Colors.shembe} outerColor={Colors.fadedGray} isCheck={item[1].selected} clicked={(id: string, value: boolean) => this.longPress(id, value)} />
                        }
                        <TouchableOpacity style={styles.row2} onPress={() => this.oneOnOneChat(item[1].uid, item[1].name)} activeOpacity={1} >
                            <Text style={styles.nameSet} >{item[1].name}</Text>
                            <VectorIcons.Ionicons name='ios-chatbubbles' color={Colors.shembe} size={vh(30)} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.separator} />
                </View>
            )
        })

    }

    render() {
        return (
            <View style={styles.main} >
                <View style={styles.iconView} >
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                        <VectorIcons.Ionicons name='md-arrow-back' size={vh(30)} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addMessage} onPress={() => this.multipleToSelect(!this.state.showSelected)} >
                        <VectorIcons.MaterialIcons name='group-add' size={vh(30)} color={Colors.shembe} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.chats} >Contacts</Text>
                {this.renderData()}
                {this.state.showSelected &&
                    <TouchableOpacity style={styles.submitButton} onPress={this.createGroup}>
                        <LinearGradient style={styles.submitButtonInner} colors={colors} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
                            <VectorIcons.Ionicons name={'md-arrow-forward'} size={vh(35)} color={Colors.white} />
                        </LinearGradient>
                    </TouchableOpacity>
                }
            </View>
        )
    }
}