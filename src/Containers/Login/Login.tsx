import React from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
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
            name: 'Alice',
            email: 'test@live.com',
            password: '123456',
            avatar: 'https://qph.fs.quoracdn.net/main-raw-17018785-wbnnjvopvxaqndwovgqjtmovtvzrpvpv.jpeg'
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

    onPressLogin = () => {
        const user = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            avatar: this.state.avatar
        };

        FirebaseService.login(
            user,
            this.loginSuccess,
            this.loginFailed
        );
    };

    loginSuccess = (data: any) => {
        console.log(data)
        console.log('data over here ', data.user._user.uid, this.state.avatar, data.user.email, data.user.displayName)
       
        this.props.navigation.navigate('Chat', {
            name: data.user.displayName,
            email: data.user.email,
            avatar: this.state.avatar,
            userId: data.user._user.uid
        });
    };

    loginFailed = () => {
        alert('Login failure. Please tried again.');
    };

    onChangeTextEmail = (email: string) => this.setState({ email });
    onChangeTextPassword = (password: string) => this.setState({ password });


    render() {
        return (
            <View style={styles.main} >
                <Text style={styles.title}>Email:</Text>
                <TextInput
                    style={styles.nameInput}
                    placeholder="test3@gmail.com"
                    onChangeText={this.onChangeTextEmail}
                    value={this.state.email}
                />
                <Text style={styles.title}>Password:</Text>
                <TextInput
                    style={styles.nameInput}
                    onChangeText={this.onChangeTextPassword}
                    value={this.state.password}
                />
                <TouchableOpacity style={styles.button} onPress={this.onPressLogin} >
                    <Text style={styles.buttonText} >Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('SignUp')} >
                    <Text style={styles.buttonText} >Signup</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
