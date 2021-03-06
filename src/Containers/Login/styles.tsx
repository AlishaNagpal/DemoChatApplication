import { StyleSheet } from 'react-native';
import { vh, vw, Colors, DesignWidth } from "../../Constants";

const Styles = StyleSheet.create({
    main: {
        backgroundColor: Colors.white,
        flex: 1
    },
    header: {
        height: vw(100),
        width: vw(DesignWidth),
    },
    headerText: {
        fontSize: vh(34),
        color: Colors.shembe,
        alignSelf: 'center',
        marginTop: vh(50),
        fontFamily: 'Medinah'
    },
    imageStyle: {
        height: vh(150),
        width: vw(130),
        position: 'absolute',
        right: vw(0),
        top: vw(0),
    },
    signUP: {
        position: 'absolute',
        right: vw(10),
        top: vw(65)
    },
    signUpText: {
        color: Colors.shembe,
        fontSize: vh(18),
        fontWeight: 'bold',
    },
    signIn: {
        fontWeight: 'bold',
        fontSize: vh(25)
    },
    alignView:{
        marginTop: vh(60),
        alignSelf:'center'
    },
    icSlection: {
        width: vw(25)
    },
    welcome: {
        marginTop: vh(20),
        fontSize: vh(15),
        fontWeight: '700'
    },
    nameInput: {
        width: vw(315),
        height: vh(55),
        backgroundColor: Colors.textInput,
        marginTop: vh(20),
        padding: vw(10),
        borderRadius: vh(10),
        fontSize: vh(16),
        borderWidth:vw(1),
    },
    eye: {
        position: 'absolute',
        alignSelf:'center',
        top: vh(40),
        right: vw(20)
    },
    eyeOpen: {
        height: vw(15),
        width: vw(25)
    },
    submitButton: {
        width: vw(315),
        height: vh(55),
        alignItems: 'center',
        marginTop: vh(45),
        borderRadius: vh(10),
        justifyContent:'center'
    },
    submit:{
        fontWeight:'700',
        color:Colors.white,
        fontSize:vh(16)
    }
})
export default Styles;