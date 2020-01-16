import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import FirebaseService from '../../utils/FirebaseService';
import styles from './styles'

export interface Props {
    navigation: any
}

interface State {
    name: string,
    email: string,
    password: string,
    avatar: string,
    data: any,
}

export default class Login extends React.Component<Props, State> {

    static navigationOptions = {
        title: 'RN + Firebase Chat App'
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            data: null,
            name: '',
            email: '',
            password: '',
            avatar: '',
        };
    }

    componentDidMount() {
        FirebaseService.readUserData(this.getData)
    }

    getData = (data: any) => {
        var result = Object.keys(data).map(function (key) {
            return [String(key), data[key]];
        })
        this.setState({
            data: result
        })
    }

    onPressLogin = () => {
        const user = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            avatar: this.state.avatar
        };

        if(this.state.email !== '' && this.state.password !== ''){
            FirebaseService.login(
                user,
                this.loginSuccess,
                this.loginFailed
            );
        }else{
            Alert.alert('Fill all the details please!')
        }

        
    };

    findingImage = (id: string) => {
        let tempArray = this.state.data
        let indexToFind = tempArray.findIndex((item: any) => item[0] === id)

        this.setState({
            avatar: tempArray[indexToFind][1].image
        })
    }

    loginSuccess = (data: any) => {
        console.log(data.user.displayName, data.user.email, this.state.avatar, data.user._user.uid)
        this.findingImage(data.user._user.uid)
        this.props.navigation.navigate('Users', {
            name: data.user.displayName,
            email: data.user.email,
            avatar: this.state.avatar,
            userId: data.user._user.uid,
        });
    };

    loginFailed = () => {
        this.props.navigation.navigate('SignUp')
    };

    onChangeTextEmail = (email: string) => this.setState({ email });
    onChangeTextPassword = (password: string) => this.setState({ password });


    render() {
        return (
            <View style={styles.main} >
                <Text style={styles.title}>Email:</Text>
                <TextInput
                    style={styles.nameInput}
                    placeholder="test@live.com"
                    onChangeText={this.onChangeTextEmail}
                    value={this.state.email}
                />
                <Text style={styles.title}>Password:</Text>
                <TextInput
                    placeholder="123456"
                    style={styles.nameInput}
                    onChangeText={this.onChangeTextPassword}
                    value={this.state.password}
                />
                <TouchableOpacity style={styles.button} onPress={this.onPressLogin} >
                    <Text style={styles.buttonText} >Login</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
