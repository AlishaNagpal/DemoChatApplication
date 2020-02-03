import React from 'react';
import { InputToolbar } from 'react-native-gifted-chat';
import { vh, VectorIcons, Colors, vw } from "../Constants";
import { TouchableOpacity, Platform } from 'react-native'
import styles from './styles'
import ImagePicker from 'react-native-image-crop-picker'
import { MediaMessageAction, forFooter, RemoveTask } from '../Modules/MediaMessage/MediaMessageAction'
import { connect } from 'react-redux'
import FirebaseServices from '../utils/FirebaseService'
import ActionSheet from 'react-native-action-sheet';
import S3Handler from "../utils/S3Handler";

export interface Props {
    props: any,
    mediaMessage: Array<any>,
    MediaMessageAction: Function,
    reRenderMessages: Function,
    forFooter: Function,
    RemoveTask: Function,
    type: string
}

interface State {

}

var BUTTONSiOS = [
    'Send a Photo',
    'Send a Video',
    'Cancel'
];

var BUTTONSandroid = [
    'Send a Photo',
    'Send a Video'
];
var CANCEL_INDEX = 3;

class InputToolbarClass extends React.Component<Props, State> {
    onImageUpload = () => {
        //@ts-ignore
        ImagePicker.openPicker({
            multiple: true,
            compressImageQuality:0.6
        }).then(image => {
            const { user } = this.props
            const { mediaMessage } = this.props

            for (let i = 0; i < image.length; i++) {
                let createdAt = new Date().getTime()
                let random = ((Math.random() + createdAt) * createdAt) / Math.random()
                this.props.MediaMessageAction(
                    user.idRoom || user.GroupName,
                    user._id,
                    user.name,
                    user.otherID || user.GroupName,
                    user.otherPersonName || user.GroupName,
                    user.avatar,
                    new Date().getTime(),
                    'image',
                    image[i].filename,
                    image[i].path,
                    random.toString()
                )
                this.props.forFooter(true)
                this.props.reRenderMessages && this.props.reRenderMessages()
                // FirebaseServices.uploadPic(mediaMessage[i].senderId, mediaMessage[i].chatRoomId, mediaMessage[i].fileURL, this.getStorageURL, random)
                S3Handler.uploadImageToS3(mediaMessage[i].fileURL, mediaMessage[i].fileName,this.getStorageURL,this.errorCallBack, random.toString())
            }
        });
    };

    errorCallBack = (error: any) => {
        console.log('error',error)
    }

    getStorageURL = (url: string, uniqueID: string) => {
        const { mediaMessage } = this.props
        let num = mediaMessage.findIndex((item: any) => uniqueID === item.uniqueID)
        FirebaseServices.sendImageMessage(
            mediaMessage[num].chatRoomId,
            mediaMessage[num].senderId,
            mediaMessage[num].senderName,
            mediaMessage[num].otherID,
            mediaMessage[num].otherName,
            mediaMessage[num].avatar,
            mediaMessage[num].createdAt,
            url,
            this.props.type
        )
        this.props.RemoveTask(uniqueID)
        this.props.reRenderMessages && this.props.reRenderMessages()
        this.props.forFooter(false)
    }

    onVideoUpload = () => {
        //@ts-ignore
        ImagePicker.openPicker({
            mediaType: "video",
        }).then((video) => {
            console.log(video);
        });
    }

    showActionSheet = () => {
        ActionSheet.showActionSheetWithOptions({
            options: (Platform.OS == 'ios') ? BUTTONSiOS : BUTTONSandroid,
            cancelButtonIndex: CANCEL_INDEX,
            tintColor: 'blue'
        },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        this.onImageUpload()
                        break;
                    case 1:
                        this.onVideoUpload()
                        break;
                    default:
                        break;
                }
            });
    }

    renderAccesory = (props: any) => {
        return (
            <TouchableOpacity style={styles.main} activeOpacity={1} onPress={this.showActionSheet} >
                <VectorIcons.Ionicons name='ios-add-circle-outline' color={Colors.tealBlue} size={vw(30)} />
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
        forFooter: (value: boolean) => dispatch(forFooter(value)),
        RemoveTask: (value: number) => dispatch(RemoveTask(value))
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