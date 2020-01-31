// import * as Actions from "../../utils/ActionTypes";

// export const setData = (value: any) => {
//     return (dispatch: any, getState: any) => {
//         const { chatData } = getState().ChatMessagesReducer;
//         console.log(value)
//         let emptyArray = chatData
//         emptyArray = value
//         dispatch({ type: Actions.CHAT_MESSAGES, payload: { data: emptyArray } });
//     }
// }

// export const LoadEarlierMessages = (value: any) => {
//     return (dispatch: any, getState: any) => {
//         const { chatData } = getState().ChatMessagesReducer;
//         console.log(value)
//         let emptyArray = chatData
//         emptyArray = [...chatData, ...value]
//         dispatch({ type: Actions.CHAT_MESSAGES, payload: { data: emptyArray } });
//     }
// }