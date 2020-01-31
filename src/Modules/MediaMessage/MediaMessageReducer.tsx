import * as Actions from '../../utils/ActionTypes'

interface UploadType {
    chatRoomId: string;
    senderId: string;
    senderName: string;
    otherID: string;
    otherName: string;
    avatar: string;
    createdAt: number;
    fileType: string;
    fileName: string;
    fileURL: string;
    uniqueID: number;
}

const initialState = {
    Message: new Array<UploadType>(),
    renderFooter: false,
    mediaMessage: [],
};

export const MediaMessagesReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case Actions.MEDIA_MESSAGE:
            return { ...state, mediaMessage: action.payload.data }
        case Actions.RENDER_FOOTER:
            return { ...state, renderFooter: action.payload.data }
        default:
            return state
    }
}
