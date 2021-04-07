import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableHighlight,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import { FontAwesome5 } from '@expo/vector-icons';

import colors from '../assets/colors';

export default function HomeGroceriesScreen(props) {
  // Available Props:
  //   groceries (array)
  //   householdID (string)
  //   fetchData (function)

  // STATE:
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [quantityType, setQuantityType] = useState('');

  const GroceryList = props.groceries.map((grocery, index) => {
    return (
      <View style={listStyles.listItemContainer} key={index}>
        <View style={listStyles.itemAndQuantityContainer}>
          <FontAwesome5
            name={ grocery.isPurchased ? "check-circle" : "circle"}
            size={24}
            color={ grocery.isPurchased ? colors.neutralMedium : colors.primary}
            onPress={() => {
              axios.put(`http://localhost:3009/api/grocery/${grocery._id}`, {
                trueOrFalse: !grocery.isPurchased
              })
                .then((result) => props.fetchData())
                .catch((err) => console.error(err))
            }}
          />
          <Text
            style={
              grocery.isPurchased ? listStyles.itemChecked : listStyles.item
            }
          >
            {grocery.name}
          </Text>
          <Text style={
              grocery.isPurchased ? listStyles.quantityChecked : listStyles.quantity
            }
          >
            ({grocery.quantity} {grocery.quantityType})
          </Text>
        </View>
        <View style={listStyles.trashContainer}>
          <TouchableOpacity onPress={() => {
            axios.delete(`http://localhost:3009/api/grocery/${grocery._id}`)
              .then((result) => props.fetchData())
              .catch((err) => console.error(err))
          }}>
            <FontAwesome5
              name="trash-alt"
              size={20}
              color={
                grocery.isPurchased ? colors.negative : colors.neutralMedium}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  })

  return (
    <View style={styles.container}>
      <SafeAreaView style={headerStyles.header}>
        <View style={headerStyles.left}>
          <Text style={headerStyles.headerText}></Text>
        </View>
        <View style={headerStyles.center}>
          <Text style={headerStyles.headerTitle}>Groceries</Text>
        </View>
        <View style={headerStyles.right}>
          <TouchableOpacity
            underlayColor={colors.primaryLighter}
            style={{ marginRight: 8 }}
            onPress={() => {
              setAddItemModalVisible(!addItemModalVisible)
            }}
          >
            <FontAwesome5 name="plus" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <View style={listStyles.listContainer}>

        {GroceryList}

      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={addItemModalVisible}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalText}>Add an item to the{'\n'}household grocery list:</Text>
            <TextInput
              style={modalStyles.inputField}
              onChangeText={text => setItemName(text)}
              value={itemName}
              autoCapitalize={'words'}
              placeholder={'Item'}
            />
            <TextInput
              style={modalStyles.inputField}
              onChangeText={text => setQuantity(text)}
              value={quantity}
              autoCapitalize={'words'}
              placeholder={'Quantity'}
              keyboardType={'numeric'}
            />
            <TextInput
              style={modalStyles.inputField}
              onChangeText={text => setQuantityType(text)}
              value={quantityType}
              autoCapitalize={'words'}
              placeholder={'Quantity Type'}
            />
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
                  axios.post('http://localhost:3009/api/grocery', {
                    name: itemName,
                    quantity: quantity,
                    quantityType: quantityType,
                    householdID: props.householdID
                  })
                    .then((result) => {
                      props.fetchData();
                      setAddItemModalVisible(!addItemModalVisible);
                      setItemName('');
                      setQuantity('');
                      setQuantityType('');
                    })
                    .catch((err) => console.error(err))
                }}
              >
                <Text style={modalStyles.textStyle}>Submit</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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

const listStyles = StyleSheet.create({
  listContainer: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  listItemContainer: {
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
    borderBottomWidth: 0.5,
    borderColor: colors.neutralMedium,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemAndQuantityContainer: {
    flexDirection: 'row',
    flex: 11,
  },
  trashContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  item: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '500',
    color: colors.neutralDark,
  },
  itemChecked: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '500',
    color: colors.neutralMedium,
    textDecorationLine: "line-through",
  },
  quantity: {
    fontSize: 18,
    color: colors.neutralMedium,
    marginLeft: 6,
  },
  quantityChecked: {
    fontSize: 18,
    color: colors.neutralLight,
    marginLeft: 6,
    textDecorationLine: "line-through",
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
