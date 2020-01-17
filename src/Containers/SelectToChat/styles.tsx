import { StyleSheet } from 'react-native';
import { vh, vw, Colors } from "../../Constants";

const Styles = StyleSheet.create({
    main: {
        backgroundColor: Colors.white,
        flex: 1

    },
    iconView: {
        marginTop: vh(45),
        justifyContent: 'space-between',
        left: vw(15),
        flexDirection: 'row'
    },
    addMessage: {
        marginRight: vw(20)
    },
    chats: {
        fontSize: vh(25),
        fontWeight: 'bold',
        marginLeft: vw(15),
        marginTop: vh(20)
    },
    messageView: {
        flexDirection: 'row'
    },
    separator: {
        height: vh(2),
        width: vw(400),
        alignSelf: 'center',
        backgroundColor: Colors.textInput,
        marginBottom:vh(10)
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    row2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        marginTop: vh(15),
        marginLeft: vw(20)
    },
    multipleAccount: {
        marginLeft: vw(30),
        alignSelf: 'center',
        marginTop: vw(20)
    },
    submitButton: {
        position: 'absolute',
        right: vw(30),
        bottom: vw(70),
    },
    submitButtonInner: {
        height: vh(56),
        width: vh(56),
        borderRadius: vh(30),
        alignItems:'center',
        justifyContent:'center'
    },
    image: {
        height: vw(50),
        width: vw(50),
        borderRadius: vw(25),
        margin: vw(20),
    },
    nameSet: {
        fontSize: vh(18),
    },
    checkbox: {
        marginLeft: vw(10),
        marginTop:vh(18),
        borderRadius:vh(10)
    },
    icon: {
        marginRight: vw(20),
        alignSelf: 'center'
    }
})
export default Styles;