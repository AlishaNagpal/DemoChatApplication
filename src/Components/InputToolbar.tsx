import React from 'react';
import { InputToolbar } from 'react-native-gifted-chat';
import { vh, VectorIcons, Colors } from "../Constants";
import { TouchableOpacity } from 'react-native'
import styles from './styles'
import ImagePicker from 'react-native-image-crop-picker'
import { MediaMessageAction, forFooter } from '../Modules/MediaMessage/MediaMessageAction'
import { connect } from 'react-redux'
import FirebaseServices from '../utils/FirebaseService'

export interface Props {
    props: any,
    mediaMessage: Array<any>,
    MediaMessageAction: Function,
    reRenderMessages: Function,
    forFooter: Function
}

interface State {
    num: number
}

class InputToolbarClass extends React.Component<Props, State> {
    state = { num: 0 }

    onImageUpload = () => {
        //@ts-ignore
        ImagePicker.openPicker({
            cropping: true
        }).then(image => {
            const { user } = this.props
            const { mediaMessage } = this.props
            const { num } = this.state
            let createdAt = new Date().getTime()
            let random = Math.random() + createdAt
            console.log('running onece')
            this.props.MediaMessageAction(
                user.idRoom || user.GroupName,
                user._id,
                user.name,
                user.otherID,
                user.otherPersonName,
                user.avatar,
                new Date().getTime(),
                'image',
                image.filename,
                image.path,
                random.toString()
            )
            
            this.props.forFooter(true)
            this.setState({ num: this.props.mediaMessage.length - 1 })
            console.log('this.props.mediaMessage.length', this.props.mediaMessage, this.props.mediaMessage.length)
            // FirebaseServices.uploadPic(mediaMessage[num].senderId, mediaMessage[num].chatRoomId, mediaMessage[num].fileURL, this.getStorageURL, num, random)
            this.props.reRenderMessages && this.props.reRenderMessages()
        });
    };

    getStorageURL = (url: string, num: number) => {
        const { mediaMessage } = this.props
        // FirebaseServices.sendImageMessage(
        //     mediaMessage[num].chatRoomId,
        //     mediaMessage[num].senderId,
        //     mediaMessage[num].senderName,
        //     mediaMessage[num].otherID,
        //     mediaMessage[num].otherName,
        //     mediaMessage[num].avatar,
        //     mediaMessage[num].createdAt,
        //     url,
        // )
        // this.props.reRenderMessages && this.props.reRenderMessages()
        // this.props.forFooter(false)
    }

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

function mapDispatchToProps(dispatch: Function) {
    return {
        MediaMessageAction: (
            chatRoomId: string,
            senderId: string,
            senderName: string,
            otherID: string,
            otherName: string,
            avatar: string,
            createdAt: number,
            fileType: string,
            fileName: string,
            fileURL: string,
            uniqueID: string
        ) => dispatch(MediaMessageAction(
            chatRoomId,
            senderId,
            senderName,
            otherID,
            otherName,
            avatar,
            createdAt,
            fileType,
            fileName,
            fileURL,
            uniqueID
        )),
        forFooter: (value: boolean) => dispatch(forFooter(value))
    }
}

function mapStateToProps(state: any) {
    const { mediaMessage } = state.MediaMessagesReducer;
    return {
        mediaMessage
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InputToolbarClass);