import React from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import styles from './styles'
import { Colors, vh, VectorIcons } from '../../Constants';
import { CheckBox } from '../../Components'
import LinearGradient from 'react-native-linear-gradient';
const colors = [Colors.shembe, Colors.weirdGreen]

export interface Props {
    navigation: any
}

interface State {
    data: any,
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
            data: this.props.navigation.getParam('data'),
            name: this.props.navigation.getParam('name'),
            email: this.props.navigation.getParam('email'),
            uid: this.props.navigation.getParam('userId'),
            avatar: this.props.navigation.getParam('avatar'),
            showSelected: false,
            arr: [],
        };
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
            theOtherPerson: otherperson
        });
    }

    createGroup = () => {
        this.props.navigation.navigate('MultipleChat', {
            selectedID: this.state.arr,
            personalID: this.state.uid,
            userName:this.state.name,
            userImage:this.state.avatar,
        })
    }

    // getUnique = (array: any) => {
    //     var uniqueArray = [];

    //     // Loop through array values
    //     for (let i = 0; i < array.length; i++) {
    //         if (uniqueArray.indexOf(array[i]) === -1) {
    //             uniqueArray.push(array[i]);
    //         }
    //     }
    //     return uniqueArray;
    // }

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
        // console.log(item)
        return (
            <View>
                <View style={styles.row} >
                    {this.state.showSelected &&
                        <CheckBox id={item[1].uid} style={styles.checkbox} outerSize={vh(20)} innerSize={vh(16)} innerColor={Colors.shembe} outerColor={Colors.fadedGray} isCheck={item[1].selected} clicked={(id: string, value: boolean) => this.longPress(id, value)} />
                    }
                    <TouchableOpacity style={styles.row2} onPress={() => this.oneOnOneChat(item[1].uid)} activeOpacity={1} >
                        <Text style={styles.nameSet} >{item[1].name}</Text>
                        <VectorIcons.Ionicons name='ios-chatbubbles' color={Colors.shembe} size={vh(30)} style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.separator} />
            </View>

        )
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
                <Text style={styles.chats} >Chats</Text>
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderData}
                    keyExtractor={(item, index) => index.toString()}
                />

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
