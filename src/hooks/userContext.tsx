import { MutableRefObject, ReactNode, createContext, useContext, useRef, useState } from "react"
import { RTCPeerConnection } from "react-native-webrtc"
import { configuration } from "../config/iceServers"

type User = {
  callerId: string
  otherUserId: string
  peerConnection: MutableRefObject<RTCPeerConnection> | null
}

type UserContent = {
  user: User
  setOtherUserId: (id: string) => void
}

const initUserData: UserContent = {
  user: {
    callerId: '',
    otherUserId: '',
    peerConnection: null,
  },
  setOtherUserId: (id) => { },
}

const UserContext = createContext(initUserData)
export const useUserContext = () => useContext(UserContext)

type Props = {
  children: ReactNode
}
const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User>({
    callerId: Math.floor(100000 + Math.random() * 900000).toString(),
    otherUserId: '',
    peerConnection: useRef(new RTCPeerConnection(configuration))
  })

  const setOtherUserId = (id: string) => setUser({ ...user, otherUserId: id })
  return (
    <UserContext.Provider value={{ user, setOtherUserId }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider