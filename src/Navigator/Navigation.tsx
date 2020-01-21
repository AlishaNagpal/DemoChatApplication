import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Chat from '../Containers/Chat/Chat'
import Login from '../Containers/Login/Login'
import SignUp from '../Containers/SignUp/SignUp'
import Users from '../Containers/Users/Users'
import GroupChat from '../Containers/GroupChat/GroupChat'
import MultipleChat from '../Containers/MultipleChat/MultipleChat';
import MultiChat from '../Containers/MultiChat/MultiChat'
import SelectToChat from '../Containers/SelectToChat/SelectToChat'

console.disableYellowBox = true

const MainStack = createStackNavigator(
    {
        Login: { screen: Login, navigationOptions: { headerShown: false } },
        Chat: { screen: Chat, navigationOptions: { headerShown: false } },
        SignUp: { screen: SignUp, navigationOptions: { headerShown: false } },
        Users: { screen: Users, navigationOptions: { headerShown: false } },
        SelectToChat: { screen: SelectToChat, navigationOptions: { headerShown: false } },
        GroupChat: GroupChat,
        MultipleChat: MultipleChat,
        MultiChat: MultiChat
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