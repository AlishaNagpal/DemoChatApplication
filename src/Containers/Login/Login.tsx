import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import FirebaseService from '../../utils/FirebaseService';
import styles from './styles'
import { Images, Colors } from "../../Constants";
import LinearGradient from 'react-native-linear-gradient'
const colors = [Colors.shembe, Colors.weirdGreen]
const disableColor = [Colors.textInput, Colors.textInput]

export interface Props {
    navigation: any
}

interface State {
    name: string,
    email: string,
    password: string,
    avatar: string,
    data: any,
    showPassword: boolean,
    submitDisabled: boolean
}

export default class Login extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            data: null,
            name: '',
            email: '',
            password: '',
            avatar: '',
            showPassword: false,
            submitDisabled: true
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

    showPassword = (value: boolean) => {
        this.setState({
            showPassword: value
        })
    }

    buttonDisabled = () => {
        if (this.state.email === '' || this.state.password === '') {
            this.setState({
                submitDisabled: true
            })
        } else {
            this.setState({
                submitDisabled: false
            })
        }
    }

    onPressLogin = () => {
        const user = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            avatar: this.state.avatar
        };

        if (this.state.email !== '' && this.state.password !== '') {
            FirebaseService.login(
                user,
                this.loginSuccess,
                this.loginFailed
            );
        } else {
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
                <View style={styles.header} >
                    <Text style={styles.headerText} >Chat</Text>
                </View>
                <Image
                    source={Images.SignUpGraphic}
                    style={styles.imageStyle}
                />
                <TouchableOpacity style={styles.signUP} >
                    <Text style={styles.signUpText} >Sign Up</Text>
                </TouchableOpacity>

                <Text style={styles.signIn} > Sign In </Text>
                <Image
                    source={Images.icSlection}
                    style={styles.icSlection}
                />

                <Text style={styles.welcome} > Welcome to Chat! </Text>
                <TextInput
                    style={styles.nameInput}
                    placeholder="Email Address"
                    onChangeText={this.onChangeTextEmail}
                    value={this.state.email}
                    ref={(ref) => { this.input1 = ref }}
                // onSubmitEditing={() => this.input2.focus()}
                // onSubmitEditing
                />
                <View>
                    <TextInput
                        placeholder="Password"
                        style={styles.nameInput}
                        onChangeText={this.onChangeTextPassword}
                        value={this.state.password}
                        secureTextEntry={!this.state.showPassword}
                        ref={(ref) => { this.input2 = ref }}
                    // onSubmitEditing={() => this.nameValidation(this.state.firstName, this.state.lastName)}
                    />
                    <TouchableOpacity style={styles.eye} onPress={() => this.showPassword(!this.state.showPassword)} >
                        <Image
                            source={this.state.showPassword ? Images.eyeEnabled : Images.eyeDisabled}
                            style={styles.eyeOpen}
                        />
                    </TouchableOpacity>
                </View>
                <LinearGradient style={styles.submitButton} colors={this.state.submitDisabled ? disableColor : colors} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
                    <TouchableOpacity onPress={this.onPressLogin} disabled={this.state.submitDisabled} >
                        <Text style={styles.submit} >Submit</Text>
                    </TouchableOpacity>
                </LinearGradient>



                {/* <Text style={styles.title}>Email:</Text>
               
                <Text style={styles.title}>Password:</Text>
                <TextInput
                    placeholder="123456"
                    style={styles.nameInput}
                    onChangeText={this.onChangeTextPassword}
                    value={this.state.password}
                />
                */}
            </View>
        );
    }
}
