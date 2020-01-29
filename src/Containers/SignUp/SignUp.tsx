import React from 'react';
// import ImagePicker from 'react-native-image-crop-picker';
import {
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert
} from 'react-native';

import firebaseSDK from '../../utils/FirebaseService';
import styles from './styles'
import { Images, VectorIcons, vh, Colors } from "../../Constants";
import { CheckBox } from '../../Components'
import LinearGradient from 'react-native-linear-gradient';
const colors = [Colors.shembe, Colors.weirdGreen]
export interface Props {
    navigation: any
}

interface State {
    name: string,
    email: string,
    password: string,
    imageURI: string,
    showPassword: boolean,
    submitDisabled: boolean,
    isChecked: boolean,
    showIndicator: boolean,
}

export default class SignUp extends React.Component<Props, State> {
    state = {
        name: '',
        email: '',
        password: '',
        imageURI: 'https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1',
        showPassword: false,
        submitDisabled: true,
        isChecked: false,
        showIndicator: false,
    };

    showPassword = (value: boolean) => {
        this.setState({
            showPassword: value
        })
    }

    buttonDisabled = () => {
        if (this.state.email === '' || this.state.password === '' || this.state.name === '' || this.state.isChecked === false) {
            this.setState({
                submitDisabled: true
            })
        } else if (!(/^[a-zA-Z ]+$/.test(this.state.name)) || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)) || !(/^[1-9A-Za-z\d]{6,}$/.test(this.state.password))) {
            this.setState({
                submitDisabled: true
            })
            Alert.alert('Your details are in incorrect format!')
        } else {
            this.setState({
                submitDisabled: false
            })
        }
    }

    //@ts-ignore
    onPressCreate = async () => {
        try {
            // let returnedData = await firebaseSDK.uploadImage(this.state.imageURI, this.state.email);
            // this.setState({
            //     imageURI: returnedData
            // })
            this.buttonDisabled()
            this.setState({
                showIndicator: true
            })
            const user = {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                imageURI: this.state.imageURI
            };
            firebaseSDK.createAccount(user, this.userUid);
        } catch ({ message }) {
            console.log('create account failed. catch error:' + message);
            this.setState({
                showIndicator: false
            })
        }
    };

    userUid = (data: any) => {
        console.log('userUid',data)
        this.setState({
            showIndicator: false
        })
        setTimeout(() => {
            firebaseSDK.writeTheUserToDatabase(this.state.name, this.state.email, data, this.state.imageURI)
            this.props.navigation.navigate('Users', {
                name: this.state.name,
                email: this.state.email,
                avatar: this.state.imageURI,
                userId: data,
            });
        }, 1000);
    }

    logging = (id: string, value: boolean) => {
        // console.log(id, value)
        this.setState({
            isChecked: value
        })
        // console.log(this.state.isChecked)
        setTimeout(() => {
            this.buttonDisabled()
        }, 500);
    }

    // onImageUpload = () => {
    //     ImagePicker.openPicker({
    //         cropping: true
    //     }).then(image => {
    //         console.log(image);
    //     });
    // };

    render() {
        return (
            <View style={styles.main} >
                <View>
                    <TouchableOpacity style={styles.backView} onPress={() => this.props.navigation.goBack()} >
                        <VectorIcons.Ionicons name={'md-arrow-back'} size={vh(25)} />
                        <Text style={styles.signIn} >Sign In</Text>
                    </TouchableOpacity>

                    <View style={styles.signUP} >
                        <Text style={styles.signUpText} >Sign Up</Text>
                        <Image
                            source={Images.icSlection}
                            style={styles.icSlection}
                        />
                        <Text style={styles.detailsText} > Please fill the details below </Text>

                        <TextInput
                            style={[styles.nameInput, { borderColor: this.state.name === '' ? Colors.white : Colors.shembe }]}
                            placeholder="Your Name"
                            onChangeText={(text) => { this.setState({ name: text }), this.buttonDisabled() }}
                            value={this.state.name}
                            onSubmitEditing={() => this.input.focus()}
                            returnKeyLabel='Next'
                            returnKeyType='next'
                            keyboardType='default'
                            keyboardAppearance='light'
                        />
                        <TextInput
                            style={[styles.nameInput, { borderColor: this.state.email === '' ? Colors.white : Colors.shembe }]}
                            placeholder="Email Address"
                            onChangeText={(text) => { this.setState({ email: text }), this.buttonDisabled() }}
                            value={this.state.email}
                            ref={(ref) => { this.input = ref }}
                            onSubmitEditing={() => this.input1.focus()}
                            returnKeyLabel='Next'
                            returnKeyType='next'
                            keyboardType='email-address'
                            keyboardAppearance='light'
                        />
                        <View>
                            <TextInput
                                placeholder="Create Password"
                                style={[styles.nameInput, { borderColor: this.state.password === '' ? Colors.white : Colors.shembe }]}
                                onChangeText={(text) => { this.setState({ password: text }), this.buttonDisabled() }}
                                value={this.state.password}
                                secureTextEntry={!this.state.showPassword}
                                ref={(ref) => { this.input1 = ref }}
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
                        {this.state.showIndicator &&
                            <ActivityIndicator size='large' style={styles.indicator} />}
                        <View style={styles.Conditions}>
                            <CheckBox id={'1'} style={styles.checkbox} outerSize={vh(20)} innerSize={vh(18)} innerColor={Colors.shembe} outerColor={Colors.fadedGray} isCheck={this.state.isChecked} clicked={(id: string, value: boolean) => this.logging(id, value)} />
                            <Text style={styles.conditionText} > I agree to the </Text>
                            <Text style={styles.conditionText2} > Terms & Conditions </Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.submitButton} onPress={this.onPressCreate} disabled={this.state.submitDisabled} >
                    <LinearGradient style={[styles.submitButtonInner, { opacity: this.state.submitDisabled ? 0.2 : 1 }]} colors={colors} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
                        <VectorIcons.Ionicons name={'md-arrow-forward'} size={vh(35)} color={Colors.white} />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    }
}