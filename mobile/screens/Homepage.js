import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Modal,
} from 'react-native';
import firebase from 'firebase';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

import colors from '../assets/colors.js';

export default function HomeScreen(props) {

  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <SafeAreaView style={headerStyles.header}>
        <View style={headerStyles.left}>
          <Text style={headerStyles.headerText}></Text>
        </View>
        <View style={headerStyles.center}>
          <Text style={headerStyles.headerTitle}>Welcome Home!</Text>
        </View>
        <View style={headerStyles.right}>
          <TouchableOpacity
            underlayColor={colors.primaryLighter}
            style={{ marginRight: 8 }}
            onPress={() => {
              setSettingsModalVisible(!settingsModalVisible)
            }}
          >
            <Image
              source={{ uri: props.pictureURL }}
              style={headerStyles.profilePhoto}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <View style={styles.mainContainer}>
        <View style={styles.tabContainer}>
          <View style={styles.tabHeadingContainer}>
            <Text style={styles.tabHeadingText}>House Overview</Text>
          </View>
          <View style={styles.tabContent}>
            <View style={styles.tabContentLeft}>
              <Text style={styles.tabTextBoldNeutral}>Street Sweeping: </Text>
            </View>
            <View style={styles.tabContentRight}>
              <Text style={styles.tabTextPrimary}>Fridays, 8–10am</Text>
            </View>
          </View>
          <View style={styles.tabContent}>
            <View style={styles.tabContentLeft}>
              <Text style={styles.tabTextBoldNeutral}>Trash Day: </Text>
            </View>
            <View style={styles.tabContentRight}>
              <Text style={styles.tabTextPrimary}>Fridays</Text>
            </View>
          </View>
        </View>
        <View style={styles.tabContainer}>
          <View style={styles.tabHeadingContainer}>
            <Text style={styles.tabHeadingText}>Expenses Summary</Text>
          </View>
          <View style={styles.tabContent}>
            <View style={styles.tabContentLeft}>
              <Text style={styles.tabTextBoldNeutral}>You owe Alvin: </Text>
            </View>
            <View style={styles.tabContentRight}>
              <Text style={styles.tabTextBoldRed}>$150.00</Text>
            </View>
          </View>
          <View style={styles.tabContent}>
            <View style={styles.tabContentLeft}>
              <Text style={styles.tabTextBoldNeutral}>Nick owes you: </Text>
            </View>
            <View style={styles.tabContentRight}>
              <Text style={styles.tabTextBoldGreen}>$50.00</Text>
            </View>
          </View>
        </View>
        <View style={styles.tabContainer}>
          <View style={styles.tabHeadingContainer}>
            <Text style={styles.tabHeadingText}>Your Chores</Text>
          </View>
          {/* view chores */}
          {
            props.chores.map((chore, index) => {
              if (chore.choreHolder === props.firstName && chore.isComplete === false) {
                const dayInWordFormat = (day) => new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(day);
                const month = (month) => new Intl.DateTimeFormat('en-US', { month: 'long' }).format(month);
                let day = new Date(chore.date);
                let choreMonth = month(day);
                let choreWordDay = dayInWordFormat(day);
                let choreDay = day.getDate();
                return (
                  <View style={styles.tabContent} key={index}>
                    <View style={styles.tabContentLeft}>
                      <Text style={styles.tabTextBoldNeutral}>{chore.name}</Text>
                    </View>
                    <View style={styles.tabContentRight}>
                      <Text style={styles.tabTextPrimary}>{choreWordDay}, {choreMonth} {choreDay}</Text>
                    </View>
                  </View>
                )
              }
            })
          }

        </View>
        <View style={styles.tabContainer}>
          <View style={styles.tabHeadingContainer}>
            <Text style={styles.tabHeadingText}>Other Household Notes</Text>
          </View>
          <View style={styles.tabContent}>
            <View style={styles.tabContentLeft}>
          <Text style={styles.tabTextBoldNeutral}>• There are {props.groceries.length} items in your household grocery list</Text>
            </View>
          </View>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsModalVisible}
      >
        <SafeAreaView style={headerStyles.header}>
          <View style={headerStyles.left}>
          <TouchableOpacity
              underlayColor={colors.primaryLighter}
              style={{ marginLeft: 8 }}
              onPress={() => {
                setSettingsModalVisible(!settingsModalVisible)
              }}
            >
              {/* <FontAwesome5 name="times" size={22} color="white" /> */}
              <MaterialIcons name="close" size={22} color="white" />

            </TouchableOpacity>
          </View>
          <View style={headerStyles.center}>
            <Text style={headerStyles.headerTitle}>Settings</Text>
          </View>
          <View style={headerStyles.right}>
          </View>
        </SafeAreaView>

        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <View style={modalStyles.modalTop}>
              <View style={modalStyles.pictureAndName}>
                <Image
                  source={{ uri: props.pictureURL }}
                  style={headerStyles.profilePhoto}
                />
                <Text style={modalStyles.userName}>{props.firstName} {props.lastName}</Text>
              </View>
              <View style={modalStyles.manageAccount}>
                <TouchableHighlight
                  underlayColor={colors.primaryLighter}
                  style={modalStyles.button}
                  onPress={() => {
                    setSettingsModalVisible(!settingsModalVisible)
                  }}
                >
                  <View style={modalStyles.buttonInner}>
                    <FontAwesome5 name="cog" size={16} color='#444' />
                    <Text style={modalStyles.manageAccountText}>
                      Manage Your Account
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
            <View style={modalStyles.modalMiddle}>
              <View style={modalStyles.household}>
                <Text style={modalStyles.householdText}>
                  My Household:
                </Text>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.primary,
                  marginLeft: 5,
                }}>
                  {props.householdName}
                </Text>
              </View>
              <View style={modalStyles.household}>
                <Text style={{
                  fontSize: 16,
                  color: colors.neutralDark,
                  marginTop: 10,
                }}>
                  Household Invite Code:
                </Text>
                <Text style={modalStyles.householdID}>
                  {props.householdID}
                </Text>
              </View>
              <View style={modalStyles.manageAccount}>
                <TouchableHighlight
                  underlayColor={colors.primaryLighter}
                  style={modalStyles.button}
                  onPress={() => {
                    setSettingsModalVisible(!settingsModalVisible)
                  }}
                >
                  <View style={modalStyles.buttonInner}>
                    <FontAwesome5 name="home" size={16} color='#444' />
                    <Text style={modalStyles.manageAccountText}>
                      Manage Your Household
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
            <View style={modalStyles.logoutContainer}>
            <TouchableHighlight
                  underlayColor={colors.negative}
                  style={modalStyles.button}
                  onPress={() => {
                    setSettingsModalVisible(!settingsModalVisible)
                    firebase.auth().signOut()
                  }}
                >
                  <View style={modalStyles.buttonInner}>
                    <FontAwesome5 name="arrow-alt-circle-left" size={16} color='#444' />
                    <Text style={modalStyles.manageAccountText}>
                      Logout
                    </Text>
                  </View>
                </TouchableHighlight>
            </View>
            <View style={modalStyles.modalLogo}>
              <Image
                style={modalStyles.logo}
                source={require('../assets/roomease_logo.png')}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const headerStyles = StyleSheet.create({
  header: {
    backgroundColor: colors.primaryDark,
    width: '100%',
    height: '11.25%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  center: {
    paddingBottom: 10,
    flex: 2,
    alignItems: 'center',
  },
  right: {
    paddingBottom: 10,
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 12,
  },
  profilePhoto: {
    width: 35,
    height: 35,
    borderRadius: 25,
  },
  left: {
    paddingBottom: 10,
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'normal',
  },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  mainContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 0,
  },
  tabContainer: {
    width: '100%',
    marginBottom: 14,
  },
  tabHeadingContainer: {
    width: '100%',
    height: 36,
    paddingLeft: 1,
    paddingBottom: 2,
    // alignItems: 'center',
    justifyContent: 'flex-end',
    borderBottomWidth: .5,
    borderColor: colors.neutralMedium,
  },
  tabHeadingText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.neutralMedium,
  },
  tabContent: {
    padding: 10,
    paddingTop: 8,
    paddingBottom: 0,
    flexDirection: 'row',
  },
  tabContentLeft: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexGrow: 1,
    flexWrap: 'wrap',
  },
  tabContentRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexGrow: 1,
  },
  tabContentText: {
    color: colors.neutralDark,
    fontSize: 15,
  },
  tabTextPrimary: {
    color: colors.primary,
    fontSize: 15,
  },
  tabTextBoldPrimary: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  tabTextBoldNeutral: {
    color: colors.neutralDark,
    fontSize: 15,
    fontWeight: '500',
  },
  tabTextBoldGreen: {
    color: colors.secondary,
    fontSize: 15,
    fontWeight: '500',
  },
  tabTextBoldRed: {
    color: colors.negative,
    fontSize: 15,
    fontWeight: '500',
  },
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    elevation: 5,
  },
  modalTop: {
    width: '100%',
    padding: 22,
    borderBottomWidth: 0.5,
    borderColor: colors.neutralLight,
  },
  pictureAndName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manageAccount: {
    marginTop: 20,
    alignItems: 'center',
    // flexDirection: 'row'
  },
  button: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.neutralLight,
    padding: 10,
    paddingLeft: 16,
    paddingRight: 16,
    elevation: 2,
    marginRight: 4,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manageAccountText: {
    fontSize: 15,
    color: colors.neutralDark,
    marginLeft: 10,
  },
  userName: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.neutralDark,
  },
  modalMiddle: {
    width: '100%',
    padding: 22,
    borderBottomWidth: 0.5,
    borderColor: colors.neutralLight,
  },
  household: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  householdText: {
    fontSize: 16,
    color: colors.neutralDark,
  },
  householdID: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  logoutContainer: {
    margin: 20,
  },
  modalLogo: {
    position: 'absolute',
    bottom: '9%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 183,
    height: 26,
  },
  modalText: {
    fontSize: 24,
    color: colors.primaryDark,
    marginBottom: 26,
    textAlign: 'center'
  },
  buttonsContainer: {
    width: '100%',
    paddingTop: 40,
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
  inputField: {
    fontSize: 20,
    height: 45,
    borderColor: colors.neutralLight,
    borderRadius: 25,
    borderWidth: 1,
    width: '100%',
    marginBottom: 0,
    marginTop: 10,
    textAlign: 'center'
  }
});
