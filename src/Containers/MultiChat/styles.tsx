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
        paddingTop: vh(40),
        alignItems: 'center'
    },
    icon: {
        marginLeft: vw(15)
    },
    nameText: {
        fontSize: vh(18),
        marginLeft: vw(10),
        marginBottom: Platform.OS === 'ios' ? vh(3) : 0
    },
    inputText: {
        fontSize: vh(14),
        // marginBottom:vw(15),
        height: vh(40),
        margin: vw(10),
        alignSelf: 'center',
    },
    sendView: {
        backgroundColor: Colors.tealBlue,
        height: vw(45),
        width: vw(45),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: vw(5),
        marginLeft: vw(7.5),
    },
    sendBtn: {
        backgroundColor: Colors.tealBlue,
        height: vw(45),
        width: vw(45),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: vw(5)
    },
    messagesContainerStyle: {
        paddingBottom: vh(30)
    },
    Day: {
        backgroundColor: Colors.day,
        paddingVertical: vh(8),
        paddingHorizontal: vw(13),
        borderRadius: vh(5)
    },
    dayText: {
        color: Colors.dayText
    },
    imageStyle: {
        resizeMode: 'contain',
        height: vh(30),
        width: vh(30),
        marginLeft: vw(10),
        borderRadius: vh(20),
        marginBottom: Platform.OS === 'ios' ? vh(3) : 0
    },
    typingText: {
        color: Colors.dayText,
        fontSize: vh(11),
        marginLeft: vw(10),
        marginBottom: vw(5)
    },
    footerView: {
        backgroundColor: Colors.chatBubble,
        marginLeft: vw(150),
        marginRight: vw(50),
        borderBottomEndRadius: vw(10),
        borderBottomLeftRadius: vw(10),
        borderTopLeftRadius: vw(10),
        padding: vw(10),
        marginBottom: vh(10)
    },
    timeStyle: {
        color: Colors.white,
        fontSize: vh(9),
        marginLeft: vw(130)
    },
    footerImage: {
        height: vw(180),
        width: vw(180),
        borderRadius: vw(20),
        margin: vw(10)
    },
    indicator: {
        position: 'absolute',
        alignSelf: 'center',
        top: vh(70)
    },
    arrayText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: vh(20),
        position: 'absolute',
        alignSelf: 'center',
        top: vh(70)
    },
    backgroundVideo: {
        height: vw(100),
        width: vw(200),
        marginTop: vw(10)
    },
})
export default Styles;