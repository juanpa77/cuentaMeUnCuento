import { MutableRefObject } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CallEnd from '../assets/CallEnd';
type Prop = {
  idUser: string
  setType: (type: string) => void
}

const OutgoingCall = ({ idUser, setType }: Prop) => {
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
          {idUser}
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            setType('JOIN');
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