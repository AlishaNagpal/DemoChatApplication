import { StyleSheet } from 'react-native';
import { vh, vw, Colors, DesignWidth } from "../../Constants";

const Styles = StyleSheet.create({
    main: {
        backgroundColor: Colors.white,
        flex: 1
    },
    header: {
        height: vw(100),
        width: vw(DesignWidth)
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
        width: vw(110),
        position: 'absolute',
        right: vw(0),
        top: vw(0)
    },
    signUP: {
        position: 'absolute',
        right: vw(10),
        top: vw(80)
    },
    signUpText: {
        color: Colors.shembe,
        fontSize: vh(18),
        fontWeight: 'bold',
    },
    signIn: {
        marginLeft: vw(30),
        marginTop: vh(60),
        fontWeight: 'bold',
        fontSize: vh(25)
    },
    icSlection: {
        marginLeft: vw(35),
        width: vw(25)
    },
    welcome: {
        marginTop: vh(25),
        left: vw(30),
        fontSize: vh(15),
        fontWeight: '700'
    },
    nameInput: {
        width: vw(315),
        height: vh(55),
        backgroundColor: Colors.textInput,
        alignSelf: 'center',
        marginTop: vh(25),
        padding: vw(10),
        borderRadius: vh(10),
        fontSize: vh(16)
    },
    eye: {
        position: 'absolute',
        top: vh(50),
        right: vw(70)
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
        alignSelf:'center',
        justifyContent:'center'
    },
    submit:{
        fontWeight:'700',
        color:Colors.white,
        fontSize:vh(16)
    }
})
export default Styles;