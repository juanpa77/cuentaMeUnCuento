import { View, Text, TouchableOpacity } from 'react-native';
import CallEnd from '../assets/CallEnd';
import { useUserContext } from '../hooks/userContext';
import { NavigateProps, RootStackParamList } from '../types/navigation';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  // route: RouteProp<RootStackParamList>;
  navigation: NativeStackNavigationProp<RootStackParamList>;
  closeModal: () => void
}

const OutgoingCall = ({ navigation, closeModal }: Props) => {
  const { user } = useUserContext()
  console.log(user)
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
            fontSize: 16,
            color: '#D0D4DD',
          }}>
          Calling to...
        </Text>

        <Text
          style={{
            fontSize: 36,
            marginTop: 12,
            color: '#ffff',
            letterSpacing: 6,
          }}>
          {user.otherUserId}
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            closeModal()
            // navigation.navigation('Join');
            // idUser.current = null;
          }}
          style={{
            backgroundColor: '#FF5D5D',
            borderRadius: 30,
            height: 60,
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CallEnd />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OutgoingCall