import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Home from '../screens/Home'
import Join from '../screens/Join';
import IncomingCall from '../screens/IncomingCall';
import OutgoingCall from '../screens/OutgoingCall';
import WebrtcRoom from '../screens/WebRTCRoom';
import { NavigationContainer } from '@react-navigation/native';
const Stack = createNativeStackNavigator<RootStackParamList>()

const MainStack = () => {
  const { Navigator, Screen } = Stack

  return (
    <NavigationContainer>
      <Navigator initialRouteName='Join'>
        {/* <Screen name='Home' component={Home} /> */}
        <Screen name='Join' component={Join} />
        <Screen name='IncomingCall' component={IncomingCall} />
        <Screen name='OutgoingCall' component={OutgoingCall} />
        <Screen name='WebRTCRoom' component={WebrtcRoom} />
      </Navigator>
    </NavigationContainer>
  )
}

export default MainStack