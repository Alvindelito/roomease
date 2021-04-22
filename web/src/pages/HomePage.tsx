import React from 'react';
import Header from '../components/Header';
import LargeButton from '../styles/LargeButton';
const HomePage = () => {
  return (
    <div>
      <Header title="Home"></Header>
      <LargeButton backgroundColor="black" textColor="white">
        test button
      </LargeButton>
    </div>
  );
};

export default HomePage;
