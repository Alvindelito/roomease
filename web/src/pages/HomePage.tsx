import React from 'react';
import axios from 'axios';
import Header from '../components/Header';
const HomePage = () => {
  const accessToken = () => {
    axios.post('http://localhost:3009/api/household', {
      householdName: 'cake house',
    });
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
      <button onClick={refreshToken}>refresh</button>
    </div>
  );
};

export default HomePage;
