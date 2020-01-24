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
        paddingTop: vh(30),
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
    sendView: {
        // padding: vh(7.5),
        // paddingLeft: 0
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
})
export default Styles;