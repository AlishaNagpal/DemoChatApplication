import { StyleSheet } from 'react-native';
import { vh, vw, Colors, DesignHeight, DesignWidth } from "../../Constants";

const Styles = StyleSheet.create({
    main: {
        backgroundColor: Colors.white,
        flex: 1,
        justifyContent: 'flex-start'
    },
    textInput: {
        height: vh(60),
        width: vw(350),
        alignSelf: 'center',
        borderWidth: vw(1),
        borderColor: Colors.tealBlue,
        padding: vw(10),
        borderRadius: vw(40),
        marginTop: vh(30),
        fontSize: vh(28),
        textAlign: 'center',
        fontFamily: 'Medinah'
    },
    participants: {
        fontSize: vh(30),
        color: Colors.shembe,
        alignSelf: 'center',
        marginTop: vh(30),
        marginBottom: vh(20),
        fontFamily: 'Medinah'
    },
    group: {
        fontFamily: 'Medinah',
        fontSize: vh(35),
        textAlign: 'center',
        color: Colors.chatBubble,
        marginTop: vh(75)
    },
    groupButton: {
        height: vh(150),
        width: vh(150),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: vh(90),
        alignSelf: 'center',
        marginTop: vh(30)
    },
    editIcon: {
        position: 'absolute',
        top:vh(130),
        left:vw(250)
    },
    cross:{
        position:'absolute',
        right:vw(15),
        top:vh(35)
    },
    root: {
        alignItems: 'center',
        borderBottomWidth: vh(3),
        borderColor: Colors.textInput,
        flexDirection: 'row',
        width: vw(380),
        alignSelf: "center",
    },
    image: {
        height: vw(50),
        width: vw(30),
        margin: vw(15),
        resizeMode:'contain'
    },
    nameSet: {
        fontSize: vh(20),
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