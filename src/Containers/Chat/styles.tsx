import { StyleSheet } from 'react-native';
import { vh, vw, Colors } from "../../Constants";

const Styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        alignSelf: 'center',
    },
    buttons: {
        flexDirection: 'row',
        minHeight: 70,
        alignItems: 'stretch',
        alignSelf: 'center',
        borderWidth: 5,
    },
    button: {
        flex: 1,
        paddingVertical: 0,
    },
    greeting: {
        color: '#999',
        fontWeight: 'bold',
    },
    messageStyle:{
        backgroundColor:Colors.white,
        // height:300
    }
})
export default Styles;