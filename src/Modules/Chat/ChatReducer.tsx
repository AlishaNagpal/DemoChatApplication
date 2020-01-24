import * as Actions from '../../utils/ActionTypes'

const initialState = {
    chatData: []
};


export const ChatMessagesReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case Actions.CHAT_MESSAGES:
            return { ...state, chatData: action.payload.data }
        default:
            return state
    }
}
