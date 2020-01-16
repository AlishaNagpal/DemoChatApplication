import { StyleSheet } from 'react-native';
import { vh, vw, Colors } from "../../Constants";

const Styles = StyleSheet.create({
    main: {
        backgroundColor: Colors.white,
        flex: 1

    },
    separator: {
        height: vh(2),
        width: vw(400),
        alignSelf: 'center',
        backgroundColor: Colors.profileGrey
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    row2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        flex:1,
        marginTop:vh(15),
        marginLeft: vw(20)
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
        flexDirection: 'column',
        flex:1
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
    time: {
        marginLeft: vw(20),
        flexDirection:'row'
    },
    message: {
        color: Colors.fadedGray,
        fontSize: vh(12),
        flex:1,
    },
    message2: {
        color: Colors.fadedGray,
        fontSize: vh(12),
        marginRight:vw(10)
    },
    checkbox: {
        marginLeft: vw(10)
    },
    icon: {
        marginRight: vw(20),
        alignSelf: 'center'
    }
})
export default Styles;