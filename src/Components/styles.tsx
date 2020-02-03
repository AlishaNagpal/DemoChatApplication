import { StyleSheet, Platform } from 'react-native';
import { Colors, DesignWidth, vh, vw } from "../Constants";

const Styles = StyleSheet.create({
    main: {
        width:vw(45),
        height:vw(45),
        backgroundColor:Colors.white,
        alignItems:'center',
        justifyContent:'center',
        marginLeft:vw(5),
        marginRight:vw(-20),
        borderRadius:vw(5),
        borderWidth:vw(1),
        borderColor: Colors.white,
        alignSelf:'center'
    },
})
export default Styles;