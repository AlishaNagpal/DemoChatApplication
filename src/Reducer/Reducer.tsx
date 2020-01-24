import { combineReducers } from "redux";
import {ChatMessagesReducer} from '../Modules/Chat/ChatReducer'

export const reducer = combineReducers({
    ChatMessagesReducer: ChatMessagesReducer
});