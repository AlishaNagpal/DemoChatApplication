import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { vh, vw, } from '../Constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
MaterialCommunityIcons.loadFont()

export interface Props {
    isCheck: boolean,
    clicked: Function,
    id: string,
    style: any,
    outerSize: number,
    innerColor: any,
    outerColor: any,
    innerSize: number

}

interface State {
    isCheck: boolean
}

export default class CheckBox extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isCheck: this.props.isCheck
        };
    }

    checkClicked = () => {
        this.setState(prevState => ({
            isCheck: !prevState.isCheck,
        }))
        this.props.clicked && this.props.clicked(this.props.id, !this.state.isCheck);
        // console.log(this.state.isCheck)
    }

    render() {
        return (
            <TouchableOpacity onPress={this.checkClicked} style={this.props.style} activeOpacity={1}>
                <View style={{
                    height: this.props.outerSize,
                    width: this.props.outerSize,
                    borderWidth: vw(2),
                    borderRadius: vh(0.7),
                    borderColor: this.state.isCheck ? this.props.innerColor : this.props.outerColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <View style={{
                        height: this.props.innerSize,
                        width: this.props.innerSize,
                        alignItems: 'center'
                        // backgroundColor: this.state.isCheck ? Colors.darkGreen : Colors.white,
                    }} >
                        {this.state.isCheck ? <MaterialCommunityIcons
                            name='check'
                            color={this.props.innerColor}
                            size={this.props.innerSize}
                        /> : null}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}