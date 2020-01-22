import React from 'react';
import { Text, View, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import FirebaseService from '../../utils/FirebaseService';
import styles from './styles'
import { Colors } from "../../Constants";

export interface Props {
    navigation: any,
    selectedID: any,
    personalID: string
}

interface State {
    selectedArray: any,
    personalId: string,
    textInputValue: string,
    userData: any,
    participants: any,
}

export default class MultipleChat extends React.Component<Props, State> {

    static navigationOptions = {
        title: 'Name Your Group!',
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            selectedArray: this.props.navigation.getParam('selectedID'),
            personalId: this.props.navigation.getParam('personalID'),
            textInputValue: '',
            userData: [],
            participants: [],
        };
    }

    componentDidMount() {
        FirebaseService.readUserData(this.getUsersData)
    }

    getUsersData = (data: any) => {
        var result = Object.keys(data).map(function (key) {
            return [String(key), data[key]];
        })

        this.setState({
            userData: result
        })
        let tempArray = this.state.userData
        let indexToFind = tempArray.findIndex((item: any) => item[0] === this.state.personalId)
        this.state.participants.push(tempArray[indexToFind])
        for (let i = 0; i < this.state.selectedArray.length; i++) {
            let index = tempArray.findIndex((item: any) => item[0] === this.state.selectedArray[i])
            if (index !== -1) {
                this.participantsArray(tempArray[index])
                // this.state.participants.push(tempArray[index])
            }
        }
    }

    participantsArray = (data: any) => {
        console.log('data', this.state.participants)
        let tempArr = this.state.participants
        let indexToFind = tempArr.findIndex((item: any) => console.log(item[0], data[0]))
        if (indexToFind === -1) {
            this.state.participants.push(data)
            this.forceUpdate()
        }
    }

    renderData = (rowData: any) => {
        const { item } = rowData
        return (
            <View style={styles.root} >
                {/* <Image
                    style={styles.image}
                    source={{ uri: item[1].image }}
                /> */}
                <View style={styles.lastMessage} >
                    <Text style={styles.nameSet} >{item[1].name}</Text>
                </View>
            </View>
        )
    }
    multiChat = () => {
        let roomID = this.state.textInputValue + this.state.personalId
        let otherId = ''
        for (let i = 0; i < this.state.selectedArray.length; i++) {
            otherId += this.state.selectedArray[i]
        }
        roomID += otherId

        console.log(roomID)
    }

    render() {
        return (
            <View style={styles.main} >
                <TextInput
                    style={styles.textInput}
                    placeholder={'Your group name...'}
                    value={this.state.textInputValue}
                    onChangeText={(text) => this.setState({ textInputValue: text })}
                />
                <Text style={styles.participants} >Participants</Text>
                <FlatList
                    data={this.state.participants}
                    renderItem={this.renderData}
                    keyExtractor={(item, index) => index.toString()}
                />
                <TouchableOpacity style={[styles.buttonText2, { backgroundColor: this.state.textInputValue === '' ? Colors.profileGrey : Colors.white, borderColor: this.state.textInputValue === '' ? Colors.profileGrey : Colors.redShadow, }]} disabled={this.state.textInputValue === '' ? true : false} onPress={this.multiChat} >
                    <Text style={styles.buttonText} >Create Group!</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
