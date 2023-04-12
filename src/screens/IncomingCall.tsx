import { MutableRefObject } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import CallAnswer from '../assets/CallAnswer';

type Prop = {
  idUser: string
  setType: (type: string) => void
  processAccept: () => Promise<void>
}

const IncomingCall = ({ idUser, setType, processAccept }: Prop) => {
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
          {idUser} is calling..
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
            setType('WEBRTC_ROOM');
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