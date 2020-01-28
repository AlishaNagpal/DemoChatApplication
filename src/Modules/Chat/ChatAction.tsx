import * as Actions from "../../utils/ActionTypes";

export const setData = (value: any) => {
    return (dispatch: any, getState: any) => {
        const { chatData } = getState().ChatMessagesReducer;
        let emptyArray = chatData;
        let index = emptyArray.findIndex((item:any)=>item[0]===value[0])
        if(index === -1){
            emptyArray.push(value)
        }
        function compareWhole(a: any, b: any) {
            const bandA = a[1].createdAt;
            const bandB = b[1].createdAt;
            let comparison = 0;
            if (bandA > bandB) {
                comparison = 1;
            } else if (bandA < bandB) {
                comparison = -1;
            }
            return comparison * -1;
        }
        emptyArray.sort(compareWhole)
        dispatch({ type: Actions.CHAT_MESSAGES, payload: { data: emptyArray } });
    }
}