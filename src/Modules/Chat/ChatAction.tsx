import * as Actions from "../../utils/ActionTypes";

export const setData = (value: any) => {
    return (dispatch, getState) => {
        const { profileData } = getState().Reducer;
        let emptyArray = profileData;
        emptyArray[key] = value
        dispatch({ type: key, payload: { data: emptyArray } });
    }
}