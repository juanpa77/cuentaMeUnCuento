import { NativeStackScreenProps } from "@react-navigation/native-stack"

export type RootStackParamList = {
  Home: undefined
  Join: undefined
  IncomingCall: {
    processAccept: () => Promise<void>
  }
  OutgoingCall: undefined
  WebRTCRoom: undefined
}

export type NavigateProps = NativeStackScreenProps<RootStackParamList>
