import React from 'react';
import OcticonsI from 'react-native-vector-icons/Octicons';
import IoniconsI from 'react-native-vector-icons/Ionicons';
import FontAwesomeI from 'react-native-vector-icons/FontAwesome';
import MaterialIconsI from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIconsI from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoI from 'react-native-vector-icons/Entypo';
import AntDesignI from 'react-native-vector-icons/AntDesign';
import SimpleLineIconsI from 'react-native-vector-icons/SimpleLineIcons';
import EvilIconsI from 'react-native-vector-icons/EvilIcons';
import FontAwesome5I from 'react-native-vector-icons/FontAwesome5';
import FoundationI from 'react-native-vector-icons/Foundation';
import FeatherI from "react-native-vector-icons/Feather";

export const MaterialCommunityIcons = (props: any) => (
    <MaterialCommunityIconsI {...props} />
)

const Octicons = (props: any) => <OcticonsI {...props} />
const Ionicons = (props: any) => <IoniconsI {...props} />
const FontAwesome = (props: any) => <FontAwesomeI {...props} />
const MaterialIcons = (props: any) => <MaterialIconsI {...props} />
const Entypo = (props: any) => <EntypoI {...props} />
const AntDesign = (props: any) => <AntDesignI {...props} />
const FontAwesome5 = (props: any) => <FontAwesome5I {...props} />
const SimpleLineIcons = (props: any) => <SimpleLineIconsI {...props} />
const EvilIcons = (props: any) => <EvilIconsI {...props} />
const Foundation = (props: any) => <FoundationI {...props} />
const Feather = (props: any) => <FeatherI {...props} />

export default {
    Octicons,
    MaterialCommunityIcons,
    FontAwesome,
    MaterialIcons,
    Ionicons,
    Entypo,
    AntDesign,
    FontAwesome5,
    SimpleLineIcons,
    EvilIcons,
    Foundation,
    Feather
}