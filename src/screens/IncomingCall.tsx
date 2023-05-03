import { Text, TouchableOpacity, View } from 'react-native';
import CallAnswer from '../assets/CallAnswer';
import { useUserContext } from '../hooks/userContext';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

// type IncomingCallScreen = NativeStackScreenProps<RootStackParamList, 'IncomingCall'>
type Props = {
  // route: RouteProp<RootStackParamList>;
  navigation: NativeStackNavigationProp<RootStackParamList>;
  closeModal: () => void
  processAccept: () => Promise<void>
}
const IncomingCall = ({ navigation, closeModal, processAccept }: Props) => {
  const { user } = useUserContext()

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-around',
        backgroundColor: '#050A0E',
      }}>
      <View
        style={{
          padding: 35,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 14,
        }}>
        <Text
          style={{
            fontSize: 36,
            marginTop: 12,
            color: '#ffff',
          }}>
          {user.otherUserId} is calling..
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            processAccept()
            navigation.navigate('WebRTCRoom')
          }}
          style={{
            backgroundColor: 'green',
            borderRadius: 30,
            height: 60,
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CallAnswer />
        </TouchableOpacity>
      </View>
    </View>
  );
};
//
export default IncomingCall