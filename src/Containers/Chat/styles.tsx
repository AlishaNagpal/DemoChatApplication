import { StyleSheet, Platform } from 'react-native';
import { Colors, DesignWidth, vh, vw } from "../../Constants";

const Styles = StyleSheet.create({
    main: {
        flex: 1
    },
    headerView: {
        height: vh(80),
        width: vw(DesignWidth),
        backgroundColor: Colors.white,
        flexDirection: 'row',
        paddingTop: vh(20),
        alignItems: 'center'
    },
    icon: {
        marginLeft: vw(20)
    },
    nameText: {
        fontSize: vh(18),
        marginLeft: vw(10),
        marginTop: vh(15),
        // marginBottom: Platform.OS === 'ios' ? vw(8) : 0
    },
    typingText: {
        color: Colors.dayText,
        fontSize: vh(11),
        marginLeft:vw(10),
        marginBottom:vw(5)
    },
    sendView: {
        backgroundColor: Colors.tealBlue,
        height: vh(45),
        width: vh(45),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: vh(5),
        marginLeft: vh(7.5),
    },
    sendBtn: {
        backgroundColor: Colors.tealBlue,
        height: vh(45),
        width: vh(45),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: vh(5)
    },
    messagesContainerStyle: {
        paddingBottom: vh(30)
    },
    imageStyle:{
        resizeMode:'contain',
        height: vh(30),
        width:vh(30),
        marginLeft:vw(10)
    }
})
export default Styles;