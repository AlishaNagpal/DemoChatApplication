import { StyleSheet } from 'react-native';
import { vh, vw, Colors } from "../../Constants";

const Styles = StyleSheet.create({
    main: {
        backgroundColor: Colors.white,
        flex: 1,
        // zIndex: 1
    },
    iconView: {
        marginTop: vh(45),
        justifyContent: 'space-between',
        left: vw(15),
        flexDirection: 'row',
    },
    addMessage: {
        marginRight: vw(20)
    },
    chats: {
        fontSize: vh(25),
        fontWeight: 'bold',
        marginLeft: vw(15),
        marginTop: vh(20),
    },
    signOut:{
        fontSize: vh(14),
        fontWeight: '500',
        color: Colors.shembe
    },
    noChatImage: {
        height: vh(180),
        width: vh(220),
        alignSelf: 'center',
        marginTop: vh(120),
    },
    noChat: {
        alignSelf: 'center',
        marginTop: vh(30),
        fontWeight: '700',
        fontSize: vh(25),
        color: Colors.pinkishGrey,
        marginLeft: vw(25)
    },
    centerNoChats: {
        marginLeft: vw(-40)
    },
    messageView: {
        flexDirection: 'row'
    },
    separator: {
        height: vh(2),
        width: vw(400),
        alignSelf: 'center',
        backgroundColor: Colors.textInput,
        margin: vw(5)
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
    root: {
        flexDirection: 'column',
        flex: 1
    },
    nameSet: {
        fontSize: vh(18),
    },
    time: {
        marginLeft: vw(20),
        flexDirection: 'row',
    },
    message: {
        color: Colors.fadedGray,
        fontSize: vh(12),
        flex: 1,
        marginTop: vw(10)
    },
    message2: {
        color: Colors.shembe,
        fontSize: vh(12),
        marginRight: vw(10)
    },
    loader: {
        alignSelf:'center',
        position: 'absolute',
        marginTop: vw(280),
        marginLeft: vw(80)
    },
    signOutTop:{
        flexDirection:'row',
        alignItems:'center'
    }
})
export default Styles;