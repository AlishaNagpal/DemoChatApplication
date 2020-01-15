import { StyleSheet } from 'react-native';
import { vh, vw, Colors } from "../../Constants";

const Styles = StyleSheet.create({
    main: {
        backgroundColor: Colors.white,
        flex: 1

    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    multipleAccount: {
        marginLeft: vw(30),
        alignSelf: 'center',
        marginTop: vw(20)
    },
    button: {
        height: vh(60),
        width: vw(300),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.redShadow,
        borderWidth: vh(1),
        alignSelf: 'center',
        marginTop: vh(20),
        borderRadius: vh(20),
        flexDirection: 'row',
        marginLeft: vw(15),
    },
    buttonText: {
        fontSize: vh(18),
        color: Colors.black
    },
    buttonText2: {
        height: vh(60),
        width: vw(300),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.redShadow,
        borderWidth: vh(1),
        alignSelf: 'center',
        marginTop: vh(20),
        borderRadius: vh(20),
        flexDirection: 'row',
        marginLeft: vw(15),
        marginBottom: vh(20)
    },
    root: {
        alignItems: 'center',
        borderBottomWidth: vh(1),
        borderBottomColor: Colors.profileGrey,
        flexDirection: 'row',
        width: vw(400),
        alignSelf: "center"
    },
    image: {
        height: vw(50),
        width: vw(50),
        borderRadius: vw(25),
        margin: vw(20),
    },
    nameSet: {
        color: Colors.chatBlue,
        fontSize: vh(18),
    },
    lastMessage: {
        flexDirection: 'column',
        flex: 1,
        margin: vh(15)
    },
    time: {
        flexDirection: 'column',
    },
    message: {
        color: Colors.fadedGray,
        fontSize: vh(12),
    },
    checkbox: {

    },
    icon:{
        marginRight:vw(15),
        alignSelf:'center'
    }
})
export default Styles;