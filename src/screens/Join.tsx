import { useState, useRef } from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import TextInputContainer from '../components/TextInputContainer';
import useSocket from '../hooks/useSocket';
import useCall, { configuration } from '../hooks/useCall';
import { RTCPeerConnection } from 'react-native-webrtc';
import IncomingCall from './IncomingCall';
import OutgoingCall from './OutgoingCall';

export default function Join({ }) {
  const [type, setType] = useState('JOIN');
  const [callerId, setCallerId] = useState(
    Math.floor(100000 + Math.random() * 900000).toString(),
  );
  const peerConnection = useRef(new RTCPeerConnection(configuration))
  const peerRef = peerConnection
  const [
    processCall,
    processAccept,
    otherUserId,
    setOtherUserId
  ] = useSocket({ callerId, peerRef, setType })
  const [remoteMediaStream, localMediaStream] = useCall({ peerConnection })

  const JoinScreen = () => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          backgroundColor: '#050A0E',
          justifyContent: 'center',
          paddingHorizontal: 42,
        }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <View
              style={{
                padding: 35,
                backgroundColor: '#1A1C22',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 14,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#D0D4DD',
                }}>
                Your Caller ID
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 12,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 32,
                    color: '#ffff',
                    letterSpacing: 6,
                  }}>
                  {callerId}
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: '#1A1C22',
                padding: 40,
                marginTop: 25,
                justifyContent: 'center',
                borderRadius: 14,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#D0D4DD',
                }}>
                Enter call id of another user
              </Text>
              <TextInputContainer
                placeholder={'Enter Caller ID'}
                value={otherUserId}
                setValue={(text) => setOtherUserId(text)}
                keyboardType={'number-pad'}
              />
              <TouchableOpacity
                onPress={() => {
                  processCall()
                  setType('OUTGOING_CALL');
                }}
                style={{
                  height: 50,
                  backgroundColor: '#5568FE',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 12,
                  marginTop: 16,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#FFFFFF',
                  }}>
                  Call Now
                </Text>
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  };

  switch (type) {
    case 'JOIN':
      return JoinScreen();
    case 'INCOMING_CALL':
      return IncomingCall({ processAccept, idUser: otherUserId, setType });
    case 'OUTGOING_CALL':
      return OutgoingCall({ idUser: otherUserId, setType });
    default:
      return null;
  }
}
