import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050A0E',
    justifyContent: 'center',
    paddingHorizontal: 42,
  },
  containerCallerId: {
    padding: 35,
    backgroundColor: '#1A1C22',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  textCallerId: {
    fontSize: 18,
    color: '#D0D4DD',
  },
  callerId: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
  },
  textId: {
    fontSize: 32,
    color: '#ffff',
    letterSpacing: 6,
  },
  containerInputCallerId: {
    backgroundColor: '#1A1C22',
    padding: 40,
    marginTop: 25,
    justifyContent: 'center',
    borderRadius: 14,
  },
  textInput: {
    fontSize: 18,
    color: '#D0D4DD',
  },
  btnCaller: {
    height: 50,
    backgroundColor: '#5568FE',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 16,
  },
  textBtn: {
    fontSize: 16,
    color: '#FFFFFF',
  }
})