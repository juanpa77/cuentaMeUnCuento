import { MutableRefObject, useEffect, useRef, useState } from "react";
import { mediaDevices, MediaStream, RTCIceCandidate, RTCSessionDescription } from "react-native-webrtc";
import RTCDataChannel from "react-native-webrtc/lib/typescript/RTCDataChannel";
import RTCPeerConnection from "react-native-webrtc/lib/typescript/RTCPeerConnection";
import { RTCSessionDescriptionInit } from "react-native-webrtc/lib/typescript/RTCSessionDescription";
import { io } from "socket.io-client"

const STUNServer = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
    {
      urls: 'stun:stun1.l.google.com:19302',
    },
    {
      urls: 'stun:stun2.l.google.com:19302',
    },
  ],
};

const sessionConstraints = {
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true,
    VoiceActivityDetection: true
  }
};

type Props = {
  callerId: string
  peerRef: MutableRefObject<RTCPeerConnection>
  setType: (type: string) => void
}

type CallData = {
  callerId: string
  rtcMessage: any
}

const useSocket = ({ callerId, peerRef, setType }: Props) => {
  // const otherUser = useRef<undefined | string>()
  const [otherUserId, setOtherUserId] = useState('')
  const remoteRTCMessage = useRef<any>()
  // const peerRef = useRef<undefined | RTCPeerConnection>()
  // const socket = io('http://192.168.1.6:3000')
  const socketRef = useRef(io('http://192.168.1.4:3000', {
    transports: ['websocket'],
    query: {
      callerId,
    },
  }))

  useEffect(() => {
    socketRef.current.on('newCall', (data: CallData) => {
      console.log(callerId)
      remoteRTCMessage.current = data.rtcMessage
      setOtherUserId(data.callerId)
      setType('INCOMING_CALL')
    })

    socketRef.current.on("callAnswered", (data: CallData) => {
      // 7. When Alice gets Bob's session description, she sets that as the remote description with `setRemoteDescription` method.
      remoteRTCMessage.current = data.rtcMessage;
      peerRef.current.setRemoteDescription(
        new RTCSessionDescription(remoteRTCMessage.current)
      );
      setType("WEBRTC_ROOM");
    });

    socketRef.current.on("ICEcandidate", (data: CallData) => {
      let message = data.rtcMessage;
      // When Bob gets a candidate message from Alice, he calls `addIceCandidate` to add the candidate to the remote peer description.
      if (peerRef.current) {
        peerRef?.current
          .addIceCandidate(new RTCIceCandidate(message.candidate))
          .then((dat: any) => {
            // console.log("SUCCESS", dat);
          })
          .catch((err: any) => {
            // console.log("Error", err);
          });
      }
      peerRef.current.onicecandidate = (event: any) => {
        if (event.candidate) {
          // Alice sends serialized candidate data to Bob using Socket
          sendICEcandidate({
            callerId: otherUserId,
            rtcMessage: {
              label: event.candidate.sdpMLineIndex,
              id: event.candidate.sdpMid,
              candidate: event.candidate.candidate,
            },
          });
        } else {
          console.log("End of candidates.");
        }
      };
      socketRef.current.on("ICEcandidate", (data: any) => {
        let message = data.rtcMessage;
        // When Bob gets a candidate message from Alice, he calls `addIceCandidate` to add the candidate to the remote peer description.

        if (peerRef.current) {
          peerRef?.current
            .addIceCandidate(new RTCIceCandidate(message.candidate))
            .then((data) => {
              console.log("SUCCESS");
            })
            .catch((err) => {
              // console.log("Error", err);
            });
        }
      });
    });
  }, [])

  async function processAccept() {
    // 4. Bob sets the description, Alice sent him as the remote description using `setRemoteDescription()`
    peerRef.current.setRemoteDescription(
      new RTCSessionDescription(remoteRTCMessage.current)
    );
    // 5. Bob runs the `createAnswer` method
    const sessionDescription = await peerRef.current.createAnswer();
    // 6. Bob sets that as the local description and sends it to Alice
    await peerRef.current.setLocalDescription(sessionDescription);
    answerCall({
      callerId: otherUserId,
      rtcMessage: sessionDescription,
    });
  }

  const sendICEcandidate = (data: CallData) => {
    socket.emit('ICEcandidate', data);
  }

  async function processCall() {
    // 1. Alice runs the `createOffer` method for getting SDP.
    const sessionDescription = await peerRef.current.createOffer(sessionConstraints);

    // 2. Alice sets the local description using `setLocalDescription`.
    await peerRef.current.setLocalDescription(sessionDescription);
    // console.log(otherUserId)
    // 3. Send this session description to Bob uisng socket
    sendCall({
      callerId: otherUserId,
      rtcMessage: sessionDescription,
    });
  }

  const answerCall = (data: CallData) => {
    socketRef.current.emit("answerCall", data);
  }

  const sendCall = (data: CallData) => {
    socketRef.current.emit("call", data);
  }

  return [processCall, processAccept, otherUserId, setOtherUserId] as const
}

export default useSocket