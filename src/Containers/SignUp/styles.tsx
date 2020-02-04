import { StyleSheet } from 'react-native';
import { vh, vw, Colors } from "../../Constants";

const Styles = StyleSheet.create({
    main: {
        backgroundColor: Colors.white,
        flex: 1
    },
    Conditions: {
        flexDirection: 'row',
        marginTop: vh(25),
        alignItems: 'center'
    },
    backView: {
        marginTop: vh(40),
        left: vw(15),
        flexDirection: 'row',
        alignItems: 'center',
    },
    signIn: {
        fontSize: vh(18),
        color: Colors.fadedGray,
        left: vw(10),
        fontWeight: '500',
        alignSelf:'center'
    },
    signUP: {
        marginTop: vh(44),
        left: vw(30),
    },
    signUpText: {
        fontWeight: 'bold',
        fontSize: vh(28)
    },
    icSlection: {
        width: vw(30)
    },
    detailsText: {
        marginTop: vh(25),
        fontSize: vh(17)
    },
    nameInput: {
        width: vw(345),
        height: vh(55),
        backgroundColor: Colors.textInput,
        marginTop: vh(25),
        padding: vw(10),
        borderRadius: vh(10),
        fontSize: vh(16),
        borderWidth: vw(1),
        // marginLeft: vw(20)
    },
    eye: {
        position: 'absolute',
        top: vh(47),
        right: vw(95)
    },
    eyeOpen: {
        height: vw(15),
        width: vw(25)
    },
    checkbox: {
        borderRadius: vh(20),
        marginRight: vw(10)
    },
    conditionText: {
        fontSize: vh(13),
        color: Colors.fadedGray
    },
    conditionText2: {
        fontSize: vh(13),
        color: Colors.shembe,
        marginLeft: vw(-7)
    },
    submitButton: {
        position: 'absolute',
        right: vw(30),
        bottom: vw(70),
    },
    submitButtonInner: {
        height: vh(56),
        width: vh(56),
        borderRadius: vh(30),
        alignItems:'center',
        justifyContent:'center'
    },
    indicator:{
        position:'absolute',
        top: vw(300),
        left:vw(150)
    }

})
export default Styles;