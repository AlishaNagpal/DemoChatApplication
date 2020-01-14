import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Chat from '../Containers/Chat/Chat'
import Login from '../Containers/Login/Login'
import SignUp from '../Containers/SignUp/SignUp'
import Users from '../Containers/Users/Users'


const MainStack = createStackNavigator(
    {
        Login: Login,
        Chat: Chat,
        SignUp:SignUp,
        Users: Users
    },
    {
        initialRouteName: 'Login',
    }
);

export default createAppContainer(createSwitchNavigator(
    {
        MainStack: MainStack,
    },
    {
        initialRouteName: 'MainStack',
        defaultNavigationOptions: ({ navigation }) => ({
            headerBackTitle: null,
            header: null,
        }),
    }
));