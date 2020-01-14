import { StyleSheet } from 'react-native';
import { vh, vw, Colors } from "../../Constants";

const Styles = StyleSheet.create({
    main: {
        backgroundColor: Colors.white,
        flex: 1

    },
    button: {
        height: vh(60),
        width: vw(350),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.redShadow,
        borderWidth: vh(1),
        alignSelf: 'center',
        marginTop: vh(20),
        borderRadius: vh(20),
        flexDirection:'row'
    },
    buttonText: {
        fontSize: vh(14),
        color: Colors.black
    },
    root: {
        alignItems: 'center',
        borderBottomWidth: vh(1),
        borderBottomColor: Colors.profileGrey,
        flexDirection: 'row',
        width: vw(380),
        alignSelf:"center"
    },
    image: {
        height: vw(50),
        width: vw(50),
        borderRadius: vw(25),
        margin: vw(20),
    },
    nameSet:{
        color: Colors.chatBlue,
        fontSize:vh(18)
    }
})
export default Styles;