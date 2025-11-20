import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const VALID_USERS: Record<number, string> = {
  17625: "Quetzalin",
  17626: "PurpleSpike",
  17627: "Ehecatl",
};

type LoginProps = {
  onLogin: () => void;
};

export default function LoginScreen({ onLogin }: LoginProps) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const userNumber = Number(usuario);

    if (VALID_USERS[userNumber] && VALID_USERS[userNumber] === password) {
      onLogin();
    } else {
      console.log("Error", "Usuario o contraseña incorrectos");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de Sesión</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Usuario (ej: 17625)"
          placeholderTextColor="#8A6E63"
          keyboardType="numeric"
          value={usuario}
          onChangeText={setUsuario}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#8A6E63"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F2EB",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#3E2723",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  input: {
    backgroundColor: "#EFE6DD",
    borderWidth: 1,
    borderColor: "#D7CCC8",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    color: "#4E342E",
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#6F4E37",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
