import React from 'react';
import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import FirebaseService from '../../utils/FirebaseService';
import styles from './styles'

export interface Props {
    navigation: any
}

interface State {
    data: any
}

export default class Users extends React.Component<Props, State> {

    static navigationOptions = {
        title: 'Users'
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            data: null
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

        console.log("getting the result and data", this.state.data)
    }

    renderData = (rowData: any) => {
        const { item } = rowData
        console.log('getting item', item[1])
        return (
            <View style={styles.root} >
                <Image
                    style={styles.image}
                    source={{ uri: item[1].image }}
                />
                <Text style={styles.nameSet} >{item[1].name}</Text>
            </View>
        )
    }


    render() {
        return (
            <View style={styles.main} >
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderData}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}
