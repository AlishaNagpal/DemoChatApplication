import { combineReducers } from "redux";
import {ChatMessagesReducer} from '../Modules/Chat/ChatReducer'
import {MediaMessagesReducer} from '../Modules/MediaMessage/MediaMessageReducer'

export const reducer = combineReducers({
    ChatMessagesReducer: ChatMessagesReducer,
    MediaMessagesReducer: MediaMessagesReducer
});