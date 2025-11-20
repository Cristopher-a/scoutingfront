import { Redirect } from "expo-router";
import React, { useState } from "react";
import LoginScreen from "./login";

export default function Index() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  return <Redirect href="/(tabs)" />;
}
