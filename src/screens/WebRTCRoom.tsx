import { View, TouchableOpacity, Button } from "react-native";
import { RTCView } from "react-native-webrtc";
import CallEnd from "../assets/CallEnd";
import useMediaStream from "../hooks/useMediaStream";
import { useUserContext } from "../hooks/userContext";
import { NavigateProps } from "../types/navigation";
import { useEffect, useState } from "react";

const WebrtcRoom = ({ navigation }: NavigateProps) => {
  const { user } = useUserContext()
  const [localMediaStream, remoteMediaStream, setLocalStream] = useMediaStream({ peerConnection: user.peerConnection! })
  const [update, setUpdate] = useState(1)
  const endCall = () => {
    user.peerConnection?.current.close()
    setLocalStream(undefined);
    navigation.navigate('Join')
  }

  useEffect(() => {
    console.log(user)
  }, [update])

  return (
    <>
      <Button title="test" onPress={() => setUpdate(update + 1)} />
      <View
        style={{
          flex: 1,
          backgroundColor: "#050A0E",
          paddingHorizontal: 12,
          paddingVertical: 12,
        }}
      >
        {localMediaStream ? (
          <RTCView
            objectFit={"cover"}
            style={{ flex: 1, backgroundColor: "#050A0E" }}
            streamURL={localMediaStream.toURL()}
          />
        ) : null}
        <RTCView
          objectFit={"cover"}
          style={{
            flex: 1,
            backgroundColor: "#050A0E",
            marginTop: 8,
          }}
          streamURL={remoteMediaStream.toURL()}
        />

        <View
          style={{
            marginVertical: 12,
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
        </View>
        <View>
          <TouchableOpacity onPress={endCall}>
            <CallEnd />
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

export default WebrtcRoom