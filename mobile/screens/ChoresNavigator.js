import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  SafeAreaView,
  TouchableHighlight,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
  Platform,
  ScrollView,
  ActionSheetIOS
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';

import colors from '../assets/colors';

export default function ChoresNavigator(props) {
  const [date, setDate] = useState(new Date);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(true);
  const [newChore, setNewChore] = useState('');
  const [assignedUser, setAssignedUser] = useState('');
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);

  const getWeek = () => {
    const dayInWordFormat = (day) => new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(day);
    const month = (month) => new Intl.DateTimeFormat('en-US', { month: 'long' }).format(month);
    let day = new Date(); //starts by today

    let week = [];
    for (let i = 0; i < 6; i++) {
      week.push({
        wordDay: dayInWordFormat(day),
        month: month(day),
        day: day.getDate(),
      })
      day.setDate(day.getDate() + 1);
    }

    return week;
  };

  const [week, setWeek] = useState(() => getWeek());

  const showChores = week.map((day, index) => {
    const dayInWordFormat = (day) => new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(day);
    const month = (month) => new Intl.DateTimeFormat('en-US', { month: 'long' }).format(month);
    let choresOfDay = props.chores.filter(chore => {
      let choreDay = new Date(chore.date);
      let choreWordDay = dayInWordFormat(choreDay);
      let choreMonth = dayInWordFormat(choreDay);
      if (choreWordDay === day.wordDay) {
        return true;
      }
    })

    if (choresOfDay.length > 0) {
      return (
        <View key={index}>
          <View style={mainStyles.dateHeader}>
            <Text style={mainStyles.dateText}>{day.wordDay}, {day.month} {day.day}</Text>
          </View>

          {choresOfDay.map((chore, index) => (
            <View style={mainStyles.mainChoreContainer} key={index}>
              <View style={mainStyles.choreContainer}>
                <FontAwesome5
                  name={chore.isComplete ? "check-circle" : "circle"}
                  size={24}
                  color={chore.isComplete ? colors.neutralMedium : colors.primary}
                  onPress={() => toggleComplete(chore)}
                  style={mainStyles.checkIcon}
                />
                <View style={mainStyles.choreAndUserContainer}>
                  <Text
                    style={chore.isComplete ? mainStyles.isComplete : mainStyles.choreName}
                  >
                    {chore.name}
                  </Text>
                  <Text
                    style={chore.isComplete ? mainStyles.userComplete : mainStyles.userChore}
                  >
                    {chore.choreHolder}
                  </Text>
                </View>
                <View style={mainStyles.trashContainer}>
                  <Text
                    style={mainStyles.icon}
                    onPress={() => deleteChore(chore)}
                  >
                    <FontAwesome5
                      name="trash-alt"
                      size={20}
                      color={colors.neutralMedium}
                      style={mainStyles.trashIcon}
                    />
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )
    } else {
      return null
    }
  });

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const onPress = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Alvin", "Alphina", "Nick"],
        destructiveButtonIndex: 4,
        cancelButtonIndex: 0
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          setAssignedUser('Alvin')
        } else if (buttonIndex === 2) {
          setAssignedUser('Alphina')
        } else if (buttonIndex === 3) {
          setAssignedUser('Nick')
        }
      }
    );

  const onSubmit = () => {
    axios.post('http://localhost:3009/api/chore', {
      name: newChore,
      date: date,
      choreHolder: assignedUser,
      householdID: props.householdID
    })
      .then(result => props.fetchData())
      .catch(err => console.error(err));

    setNewChore('');
    setAssignedUser('Pick a person');
  }

  // TODO: update chore to complete/incomplete
  const toggleComplete = (chore) => {
    axios.put(`http://localhost:3009/api/chore/${chore._id}`,
      {
        chore: chore,
        householdID: props.householdID
      })
      .then(result => props.fetchData())
      .catch(err => console.error(err));
  }
  // TODO: delete chore
  const deleteChore = (chore) => {
    axios.delete(`http://localhost:3009/api/chore/${chore._id}`, { data: { householdID: props.householdID } })
      .then(result => props.fetchData())
      .catch(err => console.error(err));
  }
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <SafeAreaView style={headerStyles.header}>
        <View style={headerStyles.left}>
          <Text style={headerStyles.headerText}></Text>
        </View>
        <View style={headerStyles.center}>
          <Text style={headerStyles.headerTitle}>Chores</Text>
        </View>
        <View style={headerStyles.right}>
          <TouchableOpacity
            underlayColor={colors.primaryLighterBlue}
            style={{ marginRight: 8 }}
            onPress={() => {
              setAddItemModalVisible(!addItemModalVisible)
            }}
          >
            <FontAwesome5 name="plus" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {/* MAIN SCREEN CONTENT */}
      <ScrollView>
        <View>
          {showChores}
        </View>

        {/* --- MODAL --- */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={addItemModalVisible}
        >
          <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
              <Text style={modalStyles.modalText}>Add a chore to{'\n'}the chores list:</Text>
              <TextInput
                style={modalStyles.inputField}
                onChangeText={newChore => setNewChore(newChore)}
                value={newChore}
                autoCapitalize={'words'}
                placeholder={'Add chore here'}
              />
              <View style={modalStyles.assignChoreContainer}>
                <Text style={modalStyles.choreAssignedToText}>Chore assigned to: </Text>
                {assignedUser === '' ?
                  <Button onPress={onPress} title="Assign Chore" color={colors.primary} fontSize={20} /> :
                  <TouchableOpacity
                    style={modalStyles.assignedUserButton}
                    onPress={onPress}
                  >
                    <Text style={modalStyles.assignedUserText}>{assignedUser}</Text>
                  </TouchableOpacity>
                }
              </View>

              {/* --- show date picker --- */}
              <View style={modalStyles.datePickerContainer}>
                <TouchableHighlight style={modalStyles.datePicker}>
                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode={mode}
                      is24Hour={true}
                      display="default"
                      onChange={onChange}
                    />
                  )}
                </TouchableHighlight>
              </View>

              {/* --- Submit and Cancel Buttons --- */}
              <View style={modalStyles.buttonsContainer}>
                <TouchableHighlight
                  underlayColor={colors.primaryLighter}
                  style={modalStyles.cancelButton}
                  onPress={() => {
                    setAddItemModalVisible(!addItemModalVisible)
                  }}
                >
                  <Text style={modalStyles.cancelText}>Cancel</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor={colors.primaryLighter}
                  style={modalStyles.submitButton}
                  onPress={() => {
                    onSubmit();
                    setAddItemModalVisible(!addItemModalVisible);
                  }}
                >
                  <Text style={modalStyles.textStyle}>Submit</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mainStyles = StyleSheet.create({
  dateHeader: {
    width: '100%',
    height: 34,
    backgroundColor: colors.primary,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    alignItems: 'center',
  },
  mainChoreContainer: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  choreContainer: {
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
    borderTopWidth: 0.35,
    borderColor: colors.neutralMedium,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choreAndUserContainer: {
    flex: 11,
    marginLeft: 8,
  },
  choreName: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.neutralDark,
  },
  isComplete: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.neutralMedium,
    textDecorationLine: "line-through",
  },
  icon: {
    flex: 1,
    textAlign: 'center',
  },
  userChore: {
    fontSize: 14,
    color: colors.secondary,
  },
  userComplete: {
    fontSize: 14,
    color: colors.neutralMedium,
    textDecorationLine: "line-through",
  },
  checkIcon: {
    fontSize: 24,
  },
  trashIcon: {
    fontSize: 24,
  },
  trashContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
});

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
    paddingBottom: 12,
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 12,
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

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '90%',
    // height: '60%',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 35,
    alignItems: 'center',
    // justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    fontSize: 24,
    marginBottom: 14,
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
  },
  assignChoreContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  choreAssignedToText: {
    fontSize: 20,
  },
  assignedUserText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
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
  datePicker: {
    flex: 1,
    width: '100%',
    height: 44,
  },
  datePickerContainer: {
    height: 230,
    width: '100%',
  },
});
