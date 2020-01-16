import React from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';

import firebaseSDK from '../../utils/FirebaseService';
import styles from './styles'

export interface Props {
    navigation: any
}

interface State {
    name: string,
    email: string,
    password: string,
    imageURI: string,
}

export default class SignUp extends React.Component<Props, State> {
    state = {
        name: '',
        email: '',
        password: '',
        imageURI: '',
    };
    //@ts-ignore
    onPressCreate = async () => {
        try {
            let returnedData = await firebaseSDK.uploadImage(this.state.imageURI, this.state.email);
            this.setState({
                imageURI: returnedData
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
        }
    };

    userUid = (data: any) => {
        setTimeout(() => {
            firebaseSDK.writeTheUserToDatabase(this.state.name, this.state.email, data, this.state.imageURI)
        }, 1000);
    }

    onChangeTextEmail = (email: string) => this.setState({ email });
    onChangeTextPassword = (password: string) => this.setState({ password });
    onChangeTextName = (name: string) => this.setState({ name });

    onImageUpload = () => {
        ImagePicker.openPicker({
            cropping: true
        }).then(image => {
            console.log(image);
        });
    };

    render() {
        return (
            <View style={styles.main} >
                <TouchableOpacity style={styles.button} onPress={this.onImageUpload} >
                    <Text style={styles.buttonText} >Upload Avatar</Text>
                </TouchableOpacity>
                <Image
                    source={{ uri: this.state.imageURI }}
                    style={styles.imageStyle}
                />
                <Text style={styles.title}>Email:</Text>
                <TextInput
                    style={styles.nameInput}
                    placeholder="test@live.com"
                    onChangeText={this.onChangeTextEmail}
                    value={this.state.email}
                />
                <Text style={styles.title}>Password:</Text>
                <TextInput
                    style={styles.nameInput}
                    placeholder="123456"
                    onChangeText={this.onChangeTextPassword}
                    value={this.state.password}
                />
                <Text style={styles.title}>Name:</Text>
                <TextInput
                    style={styles.nameInput}
                    placeholder="Enter Your Name"
                    onChangeText={this.onChangeTextName}
                    value={this.state.name}
                />
                <TouchableOpacity style={styles.button} onPress={this.onPressCreate} >
                    <Text style={styles.buttonText} >Signup</Text>
                </TouchableOpacity>

            </View>
        );
    }
}