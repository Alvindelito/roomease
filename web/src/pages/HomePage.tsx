import React from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { useHistory, Redirect } from 'react-router-dom';
const HomePage = () => {
  const history = useHistory();
  const accessToken = async () => {
    try {
      const res = await axios.post(
        'http://localhost:4000/token',
        {},
        {
          withCredentials: true,
        }
      );

      console.log(`new access token ${res.data.accessToken}`);
    } catch (err) {
      console.log('did not work');
    }
  };

  const makeNewHousehold = () => {
    try {
      axios.post('http://localhost:3009/api/household', {
        householdName: 'cake house',
      });
    } catch (err) {
      return history.push('/signin');
      // <Redirect to="/signin" />;
    }
  };

  const getHousehold = async () => {
    try {
      const res = await axios.get(
        'http://localhost:3009/api/household/6092dcb27d7bb3e19bce1462'
      );
      console.log('res:', res);
    } catch (err) {
      console.log('arent i suppose to catch error here', err);
      return history.push('/signin');
      // <Redirect to="/signin" />;
    }
  };

  const refreshToken = async () => {
    const res = await axios.post(
      'http://localhost:4000/token',
      {},
      {
        withCredentials: true,
      }
    );

    console.log(res);
  };

  return (
    <div>
      <Header title="Home"></Header>
      <button onClick={accessToken}>access</button>
      <button onClick={makeNewHousehold}>make new household</button>
      <button onClick={getHousehold}>get household</button>
      <button onClick={refreshToken}>refresh</button>
      <button onClick={() => history.push('/protected')}>protected</button>
    </div>
  );
};

export default HomePage;
