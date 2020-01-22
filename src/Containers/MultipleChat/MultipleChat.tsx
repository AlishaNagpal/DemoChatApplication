import React from 'react';
import { Text, View, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import FirebaseService from '../../utils/FirebaseService';
import styles from './styles'
import { Colors, VectorIcons, vh, Images } from "../../Constants";
import LinearGradient from 'react-native-linear-gradient';
const colors = [Colors.shembe, Colors.weirdGreen, '#7DEAAB']

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
        let tempArr = this.state.participants
        let indexToFind = tempArr.findIndex((item: any) => item[0] === data[0])
        if (indexToFind === -1) {
            this.state.participants.push(data)
            this.forceUpdate()
        }
    }

    renderData = (rowData: any) => {
        const { item } = rowData
        return (
            <View style={styles.root} >
                <Image
                    style={styles.image}
                    source={Images.ProfileImage}
                />
                <Text style={styles.nameSet} >{item[1].name}</Text>
            </View>
        )
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

    multiChat = () => {
        let otherId = ''
        for (let i = 0; i < this.state.participants.length; i++) {
            otherId += this.state.participants[i][0]
        }
        // console.log(otherId, allParticipants)

        this.props.navigation.navigate('MultiChat', {
            uid: this.state.personalId,
            chatRoomId: otherId,
            chatRoomName: this.state.textInputValue,
        })
    }

    render() {
        return (
            <View style={styles.main} >
                <TouchableOpacity activeOpacity={1} style={styles.cross} onPress={() => this.props.navigation.goBack()} >
                    <VectorIcons.Entypo name='cross' size={vh(30)} />
                </TouchableOpacity>
                <Text style={styles.group} >Complete your Group!</Text>
                <View>
                    <LinearGradient style={styles.groupButton} colors={colors} start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }}>
                        <VectorIcons.MaterialCommunityIcons name='account-group' color={Colors.white} size={vh(100)} />
                    </LinearGradient>
                    <TouchableOpacity style={styles.editIcon}>
                        <VectorIcons.Feather name='edit' size={vh(40)} />
                    </TouchableOpacity>
                </View>

                <TextInput
                    style={styles.textInput}
                    placeholder={'Enter Your Group Name'}
                    value={this.state.textInputValue}
                    onChangeText={(text) => this.setState({ textInputValue: text })}
                    clearButtonMode={'while-editing'}
                    onSubmitEditing={this.multiChat}
                />
                <Text style={styles.participants} >Participants</Text>
                <FlatList
                    data={this.state.participants}
                    renderItem={this.renderData}
                    keyExtractor={(item, index) => index.toString()}
                />
                <TouchableOpacity style={[styles.buttonText2, { backgroundColor: this.state.textInputValue === '' ? Colors.textInput : Colors.white, borderColor: this.state.textInputValue === '' ? Colors.white : Colors.shembe, }]} disabled={this.state.textInputValue === '' ? true : false} onPress={this.multiChat} >
                    <Text style={styles.buttonText} >Create Group!</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
