import { StyleSheet } from 'react-native';
import { vh, vw, Colors } from "../../Constants";

const Styles = StyleSheet.create({
    main: {
        backgroundColor: Colors.white,
        flex: 1

    },
    textInput: {
        height: vh(60),
        width: vw(350),
        alignSelf: 'center',
        borderWidth: vw(0.5),
        borderColor: Colors.newFadedgrey,
        padding: vw(10),
        borderRadius: vw(40),
        marginTop: vh(150),
        fontSize: vh(18)
    },
    participants: {
        fontSize: vh(20),
        color: Colors.rosa,
        alignSelf: 'center',
        marginTop: vh(30),
        marginBottom:vh(20)
    },
    root: {
        alignItems: 'center',
        borderBottomWidth: vh(1),
        // borderTopWidth: vh(1),
        borderColor: Colors.profileGrey,
        flexDirection: 'row',
        width: vw(400),
        alignSelf: "center",
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
    buttonText: {
        fontSize: vh(18),
        color: Colors.black
    },
    buttonText2: {
        height: vh(60),
        width: vw(300),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: vh(1),
        alignSelf: 'center',
        marginTop: vh(20),
        borderRadius: vh(20),
        flexDirection: 'row',
        marginLeft: vw(15),
        marginBottom: vh(20)
    },
})
export default Styles;