import {
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import TextInputContainer from '../components/TextInputContainer';
import useSocket from '../hooks/useSocket';
import { NavigateProps } from '../types/navigation';
import styles from './Join.component.style'
import { useUserContext } from '../hooks/userContext';
import { useModal } from '../hooks/useModal';
import OutgoingCall from './OutgoingCall';
import IncomingCall from './IncomingCall';


const Join = ({ navigation, route }: NavigateProps) => {
  const { user, setOtherUserId } = useUserContext()
  const [isOpenModalOutgoingCall, openModalOutgoingCall, closeModalOutgoingCall] = useModal(false)
  const [isOpenModalIncomingCall, openModalIncomingCall, closeModalIncomingCall] = useModal(false)
  const { processAccept, processCall } = useSocket({ openModalIncomingCall, navigation })

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <View
            style={styles.containerCallerId}>
            <Text
              style={styles.textCallerId}>
              Your Caller ID
            </Text>
            <View
              style={styles.callerId}>
              <Text
                style={styles.textId}>
                {user.callerId}
              </Text>
            </View>
          </View>
          <View
            style={styles.containerInputCallerId}>
            <Text
              style={styles.textInput}>
              Enter call id of another user
            </Text>
            <TextInputContainer
              placeholder={'Enter Caller ID'}
              value={user.otherUserId}
              setValue={(id) => setOtherUserId(id)}
              keyboardType={'number-pad'}
            />
            <TouchableOpacity
              onPress={() => {
                openModalOutgoingCall()
                processCall()
              }}
              style={styles.btnCaller}>
              <Text

                style={styles.textBtn}>
                Call Now
              </Text>
            </TouchableOpacity>
          </View>
          <>
            <Modal
              visible={isOpenModalOutgoingCall}
              onRequestClose={closeModalOutgoingCall}
            >
              <OutgoingCall
                navigation={navigation}

                closeModal={closeModalOutgoingCall}
              />
            </Modal>
            <Modal
              visible={isOpenModalIncomingCall}
            >
              <IncomingCall
                processAccept={processAccept}
                closeModal={closeModalIncomingCall}
                navigation={navigation}
              />
            </Modal>
          </>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
export default Join
