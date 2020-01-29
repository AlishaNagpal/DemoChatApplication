import React from 'react';
import { InputToolbar } from 'react-native-gifted-chat';
import { vh, VectorIcons, Colors } from "../Constants";
import { TouchableOpacity } from 'react-native'
import styles from './styles'
import ImagePicker from 'react-native-image-crop-picker'


export interface Props {
    props: any
}

interface State {
}

export default class InputToolbarClass extends React.Component<Props, State> {

    onImageUpload = () => {
        //@ts-ignore
        ImagePicker.openPicker({
            cropping: true
        }).then(image => {
            console.log(image.path);
        });
    };

    renderAccesory = (props: any) => {
        return (
            <TouchableOpacity style={styles.main} activeOpacity={1} onPress={this.onImageUpload} >
                <VectorIcons.Ionicons name='ios-add-circle-outline' color={Colors.tealBlue} size={vh(30)} />
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <InputToolbar
                {...this.props}
                renderActions={this.renderAccesory}
                containerStyle={{
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    paddingRight: vh(7.5),
                    alignItems: 'center',
                    justifyContent: 'center',
                    // height: vh(55),
                }}
                primaryStyle={{ alignItems: 'center' }}
            />
        )
    }
}
