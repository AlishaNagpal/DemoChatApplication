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
        height:vh(40),
        margin:vw(10),
        alignSelf:'center',
    },
    sendView: {
        padding: vh(7.5),
        paddingLeft: 0
    },
    sendBtn: {
        backgroundColor: Colors.tealBlue,
        height: vh(45),
        width: vh(45),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: vh(5)
    },
    messagesContainerStyle:{
        paddingBottom: vh(30)
    },
    Day:{
        backgroundColor:Colors.day,
        paddingVertical:vh(8),
        paddingHorizontal:vw(13),
        borderRadius:vh(5)
    },
    dayText:{
        color: Colors.dayText
    }
})
export default Styles;