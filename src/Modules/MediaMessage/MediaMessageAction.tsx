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
        const { mediaMessage } = getState().MediaMessagesReducer;
        let emptyArray: any = {}
        let array = mediaMessage
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
        array.push(emptyArray)
        dispatch({ type: Actions.MEDIA_MESSAGE, payload: { data: array } });
    }
}

export const forFooter = (value: boolean) => {
    return (dispatch: any) => {
        dispatch({ type: Actions.RENDER_FOOTER, payload: { data: value } });
    }
}


export const ArrayLenght = (value: number) => {
    return (dispatch: any) => {
        dispatch({ type: Actions.ARRAY_LENGHT, payload: { data: value } });
    }
}

export const RemoveTask = (uniqueID: number) => {
    return (dispatch: any, getState: any) => {
        const { mediaMessage } = getState().MediaMessagesReducer;
        let array = mediaMessage
        let index = array.findIndex((item: any) => item.uniqueID === uniqueID)
        if (index !== -1) {
            array.splice(index, 1)
        }
        dispatch({ type: Actions.MEDIA_MESSAGE, payload: { data: array } });
    }
}