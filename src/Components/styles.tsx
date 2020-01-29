import { StyleSheet, Platform } from 'react-native';
import { Colors, DesignWidth, vh, vw } from "../Constants";

const Styles = StyleSheet.create({
    main: {
        width:vh(45),
        height:vh(45),
        backgroundColor:Colors.white,
        alignItems:'center',
        justifyContent:'center',
        marginLeft:vh(5),
        marginRight:vh(-15),
        borderRadius:vw(5),
        borderWidth:vh(1),
        borderColor: Colors.white
    },
})
export default Styles;