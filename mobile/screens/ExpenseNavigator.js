import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Button, SafeAreaView, Alert, TextInput, TouchableOpacity, StatusBar, FlatList, TouchableHighlight, Modal, ScollView, ActionSheetIOS} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import colors from '../assets/colors.js';
import { FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';

const Stack = createStackNavigator();


export default function HomeExpenseScreen (props, {navigation}) {
  // STATE:
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('');
  const [holder, setHolder] = useState('');
  const [paid, setPaid] = useState(false);
  const [expenseType, setExpenseType] = useState('');
  const [newExpense, setNewExpense] = useState(props.expenses);
  const [expenses, setExpenses] = useState([]);

  const onSubmit = () => {
    axios.post('http://localhost:3009/api/expense', {
      name: itemName,
      amount: amount,
      expenseHolder: props.firstName,
      expenseType: expenseType,
      householdID: props.householdID
    })
      .then((result) => {
        props.fetchData();
        setAddItemModalVisible(!addItemModalVisible);
        setItemName('');
        setAmount('');
      }, () => {
        console.log('success')
      })
      .catch(err => console.error(err));
    setNewExpense('');
    setExpenseType('');
  };

  const fixedExpenses = props.expenses.filter((expense) => {
    return expense.expenseType === 'Fixed Expense'
  });


  const FixedList = fixedExpenses.map((expense, index) => {
    return (
      <View key={index} style={listStyles.listItemContainer}>
        <View style={listStyles.nameAndHolderContainer}>
          <Text style={listStyles.listName}>{expense.name}</Text>
          <Text style={listStyles.listHolder}>{expense.expenseHolder}</Text>
        </View>
        <Text style={listStyles.listAmount}>${expense.amount.$numberDecimal}</Text>
      </View>
    )
  });

  const otherExpenses = props.expenses.filter((expense) => {
    return expense.expenseType === 'Other Expense'
  });

  const OtherList = otherExpenses.map((expense, index) => {
    return (
      <View key={index} style={listStyles.listItemContainer}>
        <View style={listStyles.nameAndHolderContainer}>
          <Text style={listStyles.listName}>{expense.name}</Text>
          <Text style={listStyles.listHolder}>{expense.expenseHolder}</Text>
        </View>
        <Text style={listStyles.listAmount}>${expense.amount.$numberDecimal}</Text>
      </View>
    )
  });

  const getRoomiesTotals = (expenses) => {
    let numOfRoomies = 0;
    let totalExpenses = 0;
    let roomiesExpenses = {};
    //Calculate totals
    for(let i = 0; i < expenses.length; i++){
      if(!roomiesExpenses[expenses[i].expenseHolder]){
        numOfRoomies += 1;
        totalExpenses += parseFloat(expenses[i].amount.$numberDecimal)
        roomiesExpenses[expenses[i].expenseHolder] = parseFloat(expenses[i].amount.$numberDecimal)
      } else {
        totalExpenses += parseFloat(expenses[i].amount.$numberDecimal)
        roomiesExpenses[expenses[i].expenseHolder] += parseFloat(expenses[i].amount.$numberDecimal)
      }
    }
    //Get average amount owed
    const averageExpense = totalExpenses / numOfRoomies;
    let roomiesOwed = {}
    for(let name in roomiesExpenses) {
      roomiesOwed[name] =  roomiesExpenses[name] - averageExpense;
    }
    console.log('roomiesOwed:', roomiesOwed);
    //assign owed amounts
    let positive;
    let youOwe = [];
    let theyOwe = [];
    for (let roomie in roomiesOwed) {
      if (Math.sign(roomiesOwed[roomie]) === 1) {
        positive = roomie;
      }
      if (Math.sign(roomiesOwed[roomie]) === -1) {
        theyOwe.push([roomie + ' owes you ' , (roomiesOwed[roomie] * -1).toFixed(2)]);
        if (props.firstName === roomie){
          youOwe.push(['You owe ' + positive , (roomiesOwed[roomie] * -1).toFixed(2)]);
        }
      }
    }
    if (props.firstName === positive) {
      return (
        theyOwe.map((touple, index) => {
          return(
            <YourShare key={index} roomie={touple[0]} amount={touple[1]}/>
          )
        })
      )
    } else {
      return (
        youOwe.map((touple, index) => {
          return (
            <YourShare key={index} roomie={touple[0]} amount={touple[1]} />
          )
        })
      )
    }
  };

    // Your share checkbox styling changes
  function YourShare({roomie, amount}) {
    const [paid, setPaid] = useState(false);
    return (
      <View style={{flexDirection: "row", alignItems: "center"}}>
      <FontAwesome5 name="circle" size={24}
        onPress={() => {
          setPaid(!paid)
        }}
        size={24}
        color={paid ? colors.neutralMedium : colors.primary}
        name={paid ? "check-circle" : "circle"}
      />

      <Text
        style={{
          alignItems: "flex-start",
          textDecorationLine: paid ? "line-through" : "none",
          color: paid ? colors.neutralMedium : colors.neutralDark,
          paddingLeft: 8,
          fontSize: 17,
          marginBottom: 5,
          marginTop: 5,
        }}>{roomie}</Text>

      <Text
        style={{
          marginLeft: "auto",
          textDecorationLine: paid ? "line-through" : "none",
          color: paid ? colors.neutralMedium : colors.neutralDark,
          paddingLeft: 8,
          fontSize: 17,
          marginBottom: 5,
          marginTop: 5,
          }}>${amount}</Text>

    </View>
    )
  }


  const yourShareTotals = getRoomiesTotals(props.expenses);

  const onPress = () =>
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ["Cancel", "Fixed Expense", "Other Expense"],
      // destructiveButtonIndex: 2,
      cancelButtonIndex: 0
    },
    buttonIndex => {
      if (buttonIndex === 0) {
        // cancel action
      } else if (buttonIndex === 1) {
        setExpenseType('Fixed Expense')
      } else if (buttonIndex === 2) {
        setExpenseType('Other Expense')
      }
    }
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={headerStyles.header}>
        <View style={headerStyles.left}>
          <Text style={headerStyles.headerText}></Text>
        </View>
        <View style={headerStyles.center}>
          <Text style={headerStyles.headerTitle}>Expenses</Text>
        </View>
        <View style={headerStyles.right}>
          <TouchableHighlight
            underlayColor={colors.primaryLighter}
            style={{ marginRight: 8 }}
            onPress={() => {
              setAddItemModalVisible(!addItemModalVisible)
            }}
          >
            <FontAwesome5 name="plus" size={18} color="white" />
          </TouchableHighlight>
        </View>
      </SafeAreaView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={addItemModalVisible}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalText}>
              What did you buy today?
            </Text>

            <TouchableOpacity
              onPress={onPress}
              style={modalStyles.expenseTypeButton}
            >
              {/* Expense type—if expense is chosen,
                  replace button with expense type:  */}
              {expenseType === '' ?
                <Text style={modalStyles.expenseTypeButtonText}
                >What type of expense is it?
                </Text> :
                <Text style={modalStyles.expenseTypeButtonText}
                >{expenseType}
                </Text>
              }
            </TouchableOpacity>

            <TextInput
              style={modalStyles.inputField}
              onChangeText={text => setItemName(text)}
              value={itemName}
              autoCapitalize={'words'}
              placeholder={'Item'}
            />
            <TextInput
              style={modalStyles.inputField}
              onChangeText={text => setAmount(text)}
              value={amount}
              autoCapitalize={'words'}
              placeholder={'Amount'}
              keyboardType={'numeric'}
            />
            <View style={modalStyles.buttonsContainer}>
              <TouchableHighlight
                underlayColor={colors.primaryLighter}
                style={modalStyles.submitButton}
                onPress={() => {
                  onSubmit();
                  setAddItemModalVisible(!addItemModalVisible)
                }}
              >
                <Text style={modalStyles.textStyle}>Submit</Text>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={colors.primaryLighter}
                style={modalStyles.cancelButton}
                onPress={() => {
                  setAddItemModalVisible(!addItemModalVisible)
                }}
              >
                <Text style={modalStyles.cancelText}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>


      <View style={styles.containerBody}>

        <Text style={{fontSize: 35, color: colors.primary, textAlign: "center", fontWeight: "bold"}}>NOVEMBER</Text>

        <Text style={listStyles.listTitles, {color: "gray",fontSize: 25, marginTop: 5}}>Fixed Monthly Expenses</Text>
        <View style={listStyles.listContainer, {height: 227, overflow: "hidden"}}>
            {FixedList}
          </View>

          <Text style={listStyles.listTitles, {color: "gray",fontSize: 25, marginTop: 5}}>Other Household Expenses</Text>
        <View style={listStyles.listContainer, {height: 227, overflow: "hidden"}}>
          {OtherList}
        </View>

        <Text style={{fontSize: 25, marginTop: 10, color: "gray", marginBottom: 5}}>Your Share</Text>
          {yourShareTotals}

        </View>
    </View>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerBody: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10
  }
});

const listStyles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  listTitles: {
    borderBottomWidth: 0.5,
    borderColor: colors.neutralMedium
  },
  listMoreBtn: {
    alignItems: "center",
  },
  listItemContainer: {
    flexDirection: 'row',
    marginLeft: 5,
    marginRight: 5,
    borderBottomWidth: 0.5,
    borderColor: colors.neutralMedium,
    height: 40,
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 5
  },
  nameAndHolderContainer: {
    flex: 2,
  },
  listName: {
    fontSize: 18,
    fontWeight: '500',
    alignItems: "flex-start",
    color: colors.neutralDark,
  },
  listHolder: {
    fontSize: 15,
    alignItems: "flex-start",
    color: colors.secondary
  },
  listAmount: {
    fontSize: 20,
    alignItems: "flex-end"
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
  },
  modalView: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  expenseTypeButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 17,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 24,
    color: colors.primaryDark,
    marginBottom: 26,
    textAlign: 'center'
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    flexDirection: 'row-reverse',
    marginTop: 10,
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
