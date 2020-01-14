import React from 'react';
import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import FirebaseService from '../../utils/FirebaseService';
import styles from './styles'

export interface Props {
    navigation: any
}

interface State {
    data: any,
    name: string,
    email: string,
    avatar: string,
    uid: string
}

export default class Users extends React.Component<Props, State> {

    static navigationOptions = {
        title: 'Users'
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            data: null,
            name: this.props.navigation.getParam('name'),
            email: this.props.navigation.getParam('email'),
            uid: this.props.navigation.getParam('userId'),
            avatar: this.props.navigation.getParam('avatar'),
        };
    }

    componentDidMount() {
        FirebaseService.readUserData(this.getMsg)
    }

    getMsg = (data: any) => {
        var result = Object.keys(data).map(function (key) {
            return [String(key), data[key]];
        })

        this.setState({
            data: result
        })

        let tempArray = this.state.data
        let indexToFind = tempArray.findIndex((item: any) => item[0] === this.state.uid)
        tempArray.splice(indexToFind, 1)
        // console.log("getting the result and data", this.state.data, arr, tempArray)
    }

    groupChat = () => {
        this.props.navigation.navigate('GroupChat', {
            name: this.state.name,
            email: this.state.email,
            avatar: this.state.avatar,
            userId: this.state.uid,
        });
    }

    oneOnOneChat(uid: string){
        //going for one on one chat
        this.props.navigation.navigate('Chat', {
            name: this.state.name,
            email: this.state.email,
            avatar: this.state.avatar,
            userId: this.state.uid,
            sendingChat: uid
        });
    }

    renderData = (rowData: any) => {
        const { item } = rowData
        return (
            <TouchableOpacity style={styles.root} onPress={()=>this.oneOnOneChat(item[1].uid)} activeOpacity={1} >
                <Image
                    style={styles.image}
                    source={{ uri: item[1].image }}
                />
                <Text style={styles.nameSet} >{item[1].name}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.main} >
                <TouchableOpacity style={styles.button} onPress={this.groupChat} activeOpacity={1} >
                    <Image
                        style={styles.image}
                        source={{ uri: this.state.avatar }}
                    />
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
