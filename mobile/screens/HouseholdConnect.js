import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ImageBackground,
  Modal,
  TouchableHighlight,
  TextInput,
} from 'react-native';
import axios from "axios";
import firebase from 'firebase';

import colors from '../assets/colors.js';

const backgroundImage = {
  uri: 'https://mvp-roomease.s3-us-west-1.amazonaws.com/Rotondo+Great+Room+Rendering.jpg'
};

export default function HouseholdConnect(props) {

  const { navigation } = props;
  const firstName = navigation.getParam('firstName', '');
  const id = navigation.getParam('id', '');

  const [
    createHouseholdModalVisible,
    setCreateHouseholdModalVisible
  ] = useState(false);
  const [
    joinHouseholdModalVisible,
    setJoinHouseholdModalVisible
  ] = useState(false);
  const [householdName, setHouseholdName] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
    >

      <Modal
        animationType="slide"
        transparent={true}
        visible={createHouseholdModalVisible}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalText}>Please choose a name{'\n'}for your household:</Text>
            <TextInput
              style={modalStyles.inputField}
              onChangeText={text => setHouseholdName(text)}
              value={householdName}
              autoCapitalize={'words'}
              placeholder={'Household Name'}
            />

            <View style={modalStyles.buttonsContainer}>
              <TouchableHighlight
                underlayColor={colors.primaryLighter}
                style={modalStyles.cancelButton}
                onPress={() => {
                  setCreateHouseholdModalVisible(!createHouseholdModalVisible)}
                }
              >
                <Text style={modalStyles.cancelText}>Cancel</Text>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={colors.primaryLighter}
                style={modalStyles.submitButton}
                onPress={() => {
                  axios.post('http://localhost:3009/api/household', {
                    name: householdName,
                    householdOwner: firstName,
                    userID: id,
                  })
                    .then((result) => {
                      props.navigation.navigate('DashboardScreen');
                    })
                    .catch((err) => console.error(err));
                  setCreateHouseholdModalVisible(!createHouseholdModalVisible)}
                }
              >
                <Text style={modalStyles.textStyle}>Submit</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={joinHouseholdModalVisible}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalText}>Paste your invite code:</Text>
            <TextInput
              style={modalStyles.inputField}
              onChangeText={text => setInviteCode(text)}
              value={inviteCode}
              autoCapitalize={'words'}
              placeholder={'Invite Code'}
            />

            <View style={modalStyles.buttonsContainer}>
              <TouchableHighlight
                underlayColor={colors.primaryLighter}
                style={modalStyles.cancelButton}
                onPress={() => {
                  setJoinHouseholdModalVisible(!joinHouseholdModalVisible)}
                }
              >
                <Text style={modalStyles.cancelText}>Cancel</Text>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={colors.primaryLighter}
                style={modalStyles.submitButton}
                onPress={() => {
                  axios.get(`http://localhost:3009/api/household/${inviteCode}`)
                    .then((household) => {
                      axios.put(`http://localhost:3009/api/user/${id}`, {
                        householdID: household.data._id,
                        firstName: firstName
                      })
                        .then((result) => {
                          props.navigation.navigate('DashboardScreen');
                        })
                        .catch((err) => console.error(err));
                    })
                    .catch((err) => console.error(err));
                  setJoinHouseholdModalVisible(!joinHouseholdModalVisible)
                }}
              >
                <Text style={modalStyles.textStyle}>Submit</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.overlay}>
        <Text style={styles.h1}>Welcome!</Text>
        <Text style={styles.paragraph}>
          Please create a household{'\n'}or join one if your roomie{'\n'}has already set one up.
        </Text>
        <AppButton
          title='Create A Household'
          onPress={() => setCreateHouseholdModalVisible(true)}
          buttonStyle={buttonStyles.buttonContainer}
          textStyle={buttonStyles.buttonText}
        />
        <AppButton
          title='Join A Household'
          onPress={() => setJoinHouseholdModalVisible(true)}
          buttonStyle={buttonStyles.secondaryButtonContainer}
          textStyle={buttonStyles.secondaryButtonText}
        />
        <AppButton
          title='Log Out'
          onPress={() => firebase.auth().signOut()}
          buttonStyle={buttonStyles.logoutBtn}
          textStyle={buttonStyles.logoutText}
        />
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    alignItems: 'center',
    justifyContent: "center"
  },
  h1: {
    color: colors.primary,
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 26,
    marginBottom: '60%',
    width: '75%',
    textAlign: 'center',
    color: colors.neutralDark,
  },
})

const AppButton = ({ onPress, title, buttonStyle, textStyle }) => (
  <TouchableOpacity
    onPress={onPress}
    style={buttonStyle}
  >
    <Text style={textStyle}>{title}</Text>
  </TouchableOpacity>
);

const buttonStyles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 10,
    width: '70%',
    paddingHorizontal: 15,
    margin: 20,
  },
  secondaryButtonContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 10,
    width: '70%',
    paddingHorizontal: 15,
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
    alignSelf: 'center',
  },
  secondaryButtonText: {
    fontSize: 24,
    color: colors.primary,
    alignSelf: 'center',
  },
  logoutBtn: {
    margin: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
})

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .6)'
  },
  modalView: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingLeft: 35,
    paddingRight: 35,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: {
      width: 1,
      height: 2
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
    elevation: 5
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 10,
    width: '40%',
    elevation: 2,
    marginLeft: 4,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 10,
    width: '40%',
    elevation: 2,
    marginRight: 4,
    flex: 1
  },
  textStyle: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  cancelText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    fontSize: 24,
    marginBottom: 26,
    textAlign: 'center'
  },
  inputField: {
    fontSize: 20,
    height: 45,
    borderColor: colors.neutralLight,
    borderRadius: 25,
    borderWidth: 1,
    width: '100%',
    marginBottom: 24,
    marginTop: 10,
    textAlign: 'center'
  }
});
