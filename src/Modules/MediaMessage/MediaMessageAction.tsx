import * as Actions from "../../utils/ActionTypes";

export const MediaMessageAction = (
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
) => {
    return (dispatch: any, getState: any) => {
        const { Message, mediaMessage } = getState().MediaMessagesReducer;
        let emptyArray = Message
        let array = mediaMessage
        console.log('MediaMessageAction',array)
        emptyArray.chatRoomId = chatRoomId
        emptyArray.senderId = senderId
        emptyArray.senderName = senderName
        emptyArray.otherID = otherID
        emptyArray.otherName = otherName
        emptyArray.avatar = avatar
        emptyArray.createdAt = createdAt
        emptyArray.fileType = fileType
        emptyArray.fileName = fileName
        emptyArray.fileURL = fileURL
        emptyArray.uniqueID = uniqueID
        console.log(Message, mediaMessage)
        array.push(emptyArray)
        console.log('in Action', array)
        dispatch({ type: Actions.MEDIA_MESSAGE, payload: { data: array } });
    }
}

export const forFooter = (value: boolean) => {
    return (dispatch: any) => {
        dispatch({ type: Actions.RENDER_FOOTER, payload: { data: value } });
    }
}