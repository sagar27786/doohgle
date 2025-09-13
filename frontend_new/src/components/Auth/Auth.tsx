import React, { useState } from 'react';
import Signup from './Signup.tsx';
import Login from './Login.tsx';

export default function Auth() {
  const [showLogin, setShowLogin] = useState(true);

  return showLogin ? (
    <Login onSwitch={() => setShowLogin(false)} />
  ) : (
    <Signup onSwitch={() => setShowLogin(true)} />
  );
}
