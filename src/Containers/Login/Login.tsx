import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import FirebaseService from '../../utils/FirebaseService';
import styles from './styles'
import { Images, Colors, Strings } from "../../Constants";
import LinearGradient from 'react-native-linear-gradient'
const colors = [Colors.shembe, Colors.weirdGreen]

export interface Props {
    navigation: any
}

interface State {
    name: string,
    email: string,
    password: string,
    avatar: string,
    showPassword: boolean,
    submitDisabled: boolean
}

export default class Login extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            avatar: Images.ProfileImage,
            showPassword: false,
            submitDisabled: true
        };
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

    loginSuccess = (data: any) => {
        this.props.navigation.navigate('Users', {
            name: data.user.displayName,
            email: data.user.email,
            avatar: this.state.avatar,
            userId: data.user._user.uid,
        });
    };

    loginFailed = () => {
        Alert.alert('Invalid Details!')
    };


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
                <TouchableOpacity style={styles.signUP} onPress={() => this.props.navigation.navigate('SignUp')} >
                    <Text style={styles.signUpText} >{Strings.signUp}</Text>
                </TouchableOpacity>
                <View style={styles.alignView} >
                    <Text style={styles.signIn} >{Strings.signIn}</Text>
                    <Image
                        source={Images.icSlection}
                        style={styles.icSlection}
                    />

                    <Text style={styles.welcome} >{Strings.welcome}</Text>
                    <TextInput
                        style={[styles.nameInput, { borderColor: this.state.email === '' ? Colors.white : Colors.shembe }]}
                        placeholder="Email Address"
                        onChangeText={(text) => { this.setState({ email: text }), this.buttonDisabled() }}
                        value={this.state.email}
                        onSubmitEditing={() => this.input.focus()}
                        returnKeyLabel='Next'
                        returnKeyType='next'
                        keyboardType='email-address'
                        keyboardAppearance='light'
                    />
                    <View>
                        <TextInput
                            placeholder="Password"
                            style={[styles.nameInput, { borderColor: this.state.password === '' ? Colors.white : Colors.shembe}]}
                            onChangeText={(text) => { this.setState({ password: text }), this.buttonDisabled() }}
                            value={this.state.password}
                            secureTextEntry={!this.state.showPassword}
                            ref={(ref) => { this.input = ref }}
                            onSubmitEditing={() => this.onPressLogin()}
                            returnKeyType='done'
                            returnKeyLabel='Submit'
                            keyboardType='default'
                            keyboardAppearance='light'
                        />
                        <TouchableOpacity style={styles.eye} onPress={() => this.showPassword(!this.state.showPassword)} >
                            <Image
                                source={this.state.showPassword ? Images.eyeEnabled : Images.eyeDisabled}
                                style={styles.eyeOpen}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={this.onPressLogin} disabled={this.state.submitDisabled} >
                        <LinearGradient style={[styles.submitButton, { opacity: this.state.submitDisabled ? 0.2 : 1 }]} colors={colors} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
                            <Text style={styles.submit} >Submit</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
