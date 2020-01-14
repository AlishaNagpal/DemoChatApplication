import { StyleSheet } from 'react-native';
import { vh, vw, Colors } from "../../Constants";

const Styles = StyleSheet.create({
    main: {
        backgroundColor: Colors.white,
        flex: 1
    },
    title: {
        // marginTop: vh(16),
        marginLeft: vw(16),
        fontSize: vh(18),
        color: Colors.black
    },
    nameInput: {
        height: vh(50),
        margin: vw(16),
        paddingHorizontal: vw(16),
        borderColor: Colors.gray,
        borderWidth: vh(1),
        fontSize: vh(16),
        borderRadius: vh(20)
    },
    button: {
        height: vh(60),
        width: vw(350),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.redShadow,
        borderWidth: vh(1),
        alignSelf: 'center',
        marginTop: vh(20),
        borderRadius: vh(20)
    },
    buttonText: {
        fontSize: vh(22),
        color: Colors.black
    },
    imageStyle: {
        height: vh(100),
        width: vh(100),
        borderRadius: vh(100),
        margin: vw(10),
        alignSelf:'center'
    }
})
export default Styles;