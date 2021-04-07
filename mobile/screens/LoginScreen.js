import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  SafeAreaView,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import * as Google from "expo-google-app-auth";
import firebase from 'firebase';
import axios from 'axios';
import { FontAwesome5 } from '@expo/vector-icons';

import colors from '../assets/colors.js';

export default class LoginScreen extends Component {
  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

  onSignIn = (googleUser) => {
    // console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
            );
        // Sign in with credential from the Google user.
        firebase.auth().signInWithCredential(credential)
        .then((result) => {
          console.log('User Signed In');
          console.log('UserID:', result.user.uid);
          if (result.additionalUserInfo.isNewUser) {
            // Save each user under their own uniqueID and set details
            firebase.database().ref('/users/' + result.user.uid).set({
              gmail: result.user.email,
              profile_picture: result.additionalUserInfo.profile.picture,
              locale: result.additionalUserInfo.profile.locale,
              first_name: result.additionalUserInfo.profile.given_name,
              last_name: result.additionalUserInfo.profile.family_name,
              created_at: Date.now()
            })
            // add user to mongodb with firebase UID
            axios.post('http://localhost:3009/signup', {
              firstName: result.additionalUserInfo.profile.given_name,
              lastName: result.additionalUserInfo.profile.family_name,
              pictureURL: result.additionalUserInfo.profile.picture,
              firebaseAuthID: result.user.uid,
            })
              .then(res => console.log('Added to the DB'))
              .catch(err => console.error(err));
          } else {
            firebase.database().ref('/users/' + result.user.uid).update({
              last_logged_in: Date.now()
            })
          }
        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
      } else {
        console.log('User already signed-in Firebase.');
      }
    });
  }

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        behavior: 'web',
        iosClientId: '550405659559-3okccbgr0edhir1oa2qtigtecvlh5mn8.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('../assets/roomease_logo.png')}
        />
        <TextInput
          style={styles.inputField}
          onChangeText={text => setItemName(text)}
          value={''}
          autoCapitalize={'words'}
          placeholder={'Email or Username'}
        />
        <TextInput
          style={styles.inputField}
          onChangeText={text => setItemName(text)}
          value={''}
          autoCapitalize={'words'}
          placeholder={'Password'}
        />
        <View style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </View>
        <TouchableOpacity
          onPress={() => { }}
          style={styles.loginButton}
          underlayColor={colors.primaryLighter}
        >
          <View style={styles.buttonContainer}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.orDivider}>
          <View style={styles.divider}></View>
          <Text style={styles.orText}>OR</Text>
          <View style={styles.divider}></View>
        </View>
        <TouchableHighlight
          onPress={() => this.signInWithGoogleAsync()}
          style={styles.googleLoginButton}
          underlayColor={colors.primaryLighter}
        >
          <View style={styles.buttonContainer}>
            <FontAwesome5 name="google" size={18} color={colors.primary} />
            <Text style={styles.googleLoginText}>Continue with Google</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 274.5,
    height: 39,
    marginBottom: 38,
  },
  inputField: {
    fontSize: 14,
    height: 45,
    borderColor: colors.neutralLight,
    borderRadius: 25,
    borderWidth: 1,
    width: '100%',
    marginBottom: 0,
    marginTop: 10,
    paddingLeft: 22,
  },
  forgotPassword: {
    width: '91%',
    alignItems: 'flex-end',
    margin: 12,
  },
  forgotPasswordText: {
    color: colors.primary,
  },
  loginButton: {
    backgroundColor: colors.primaryLight,
    borderRadius: 25,
    width: '100%',
    height: 45,
    elevation: 2,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 19,
    width: '91%'
  },
  orText: {
    color: colors.neutralMedium,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  divider: {
    borderTopWidth: .6,
    flex: 2,
    borderColor: colors.neutralMedium,
  },
  googleLoginButton: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.primary,
    width: '100%',
    height: 45,
    elevation: 2,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleLoginText: {
    color: colors.primary,
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
  },
});
