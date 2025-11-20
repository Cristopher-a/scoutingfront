import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

const App: React.FC = () => {
  const [selectedPit, setSelectedPit] = useState("Regional");
  const [visiblePit, setVisiblePit] = useState(false);
  const [teamNumber, setTeamNumber] = useState<string>("");
  const [batteryNumber, setBatteryNumber] = useState<string>("");
  const [selectedIndexTraction, setSelectedIndexTraction] = useState(0);
  const [selectedIndexWheel, setSelectedIndexWheel] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [strategyImage, setStrategyImage] = useState<string | null>(null);
  const [strategyComment, setStrategyComment] = useState<string>("");
  const [check1, setCheck1]=useState<"Sí" | "No" | null>(null);
  const [clycleNumber, setCycleNumber]= useState<string>("");
  const [artifactsNumber, setartifactsNumber]=useState<string>("");
  const CheckCircle = ({
    selected,
    label,
    onPress,
  }: {
    selected: boolean;
    label: string;
    onPress: () => void;
  }) => (
    <Pressable style={styles.checkOption} onPress={onPress}>
      <View
        style={[
          styles.circle,
          selected ? styles.circleSelected : styles.circleUnselected,
        ]}
      >
        {selected && <View style={styles.innerCircle} />}
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </Pressable>
  );

  const pitOptions = ["CDMX", "Cuautitlán", "Toluca"];
  const tractionOptions = [
  
    { name: "Mecanum", image: require("../../assets/images/mecanum.jpg") },
    { name: "Tanque", image: require("../../assets/images/swerve.jpg") },
  ];
  const wheelOptions = [
    { name: "Full Park", image: require("../../assets/images/siesta.jpg") },
    { name: "Partial Park", image: require("../../assets/images/malestacionado.jpg") },
    {name: "High Park", image: require("../../assets/images/Elevarse.jpg")}
  ];const pickAvatar = async (type: 'selected' | 'strategy') => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    console.log('Permiso denegado');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    base64: true,
  });

  if (result.canceled) {
    console.log('Usuario canceló');
    return;
  }

  const base64 = result.assets?.[0]?.base64;
  if (!base64) return;

  if (type === 'selected') {
    setSelectedImage(base64);
  } else if (type === 'strategy') {
    setStrategyImage(base64);
  }

  console.log(`${type} image base64:`, base64.substring(0, 100)); // primeras 100 letras
};

const handleSubmit = async () => {
  // Crear objeto con los datos del pit
  const pitData = {
    region: selectedPit,
    traction_type: tractionOptions[selectedIndexTraction].name,
    specialty: wheelOptions[selectedIndexWheel].name,
    team_number: teamNumber,
    battery_number: batteryNumber,
    robot_image: selectedImage,
    strategy_image: strategyImage,
    strategy_comment: strategyComment
  };

  console.log("Enviando pit:", pitData);

  try {
    const response = await fetch("https://scoutbueno.vercel.app/pits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pitData)
    });

    if (!response.ok) {
      throw new Error("Error al enviar los datos del pit");
    }

    const result = await response.json();
    console.log("Pit enviado correctamente:", result);

  } catch (error) {
    console.error("Error enviando pit:", error);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>PITS</Text>

      {/* SECCIÓN REGIONAL */}
      <View style={styles.card}>
        <Text style={styles.title}>Selecciona un Regional</Text>
        <View style={styles.buttonRow}>
          <Text style={styles.label}>Regional:</Text>
          <Pressable style={styles.button} onPress={() => setVisiblePit(true)}>
            <Text style={styles.buttonText}>{selectedPit}</Text>
          </Pressable>
        </View>
      </View>

      {/* TRACCIÓN */}
      <View style={styles.card}>
        <Text style={styles.title}>Tipo de tracción</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
          {tractionOptions.map((opt, i) => (
            <Pressable
              key={opt.name}
              style={[
                styles.optionCard,
                selectedIndexTraction === i && styles.optionSelected,
              ]}
              onPress={() => setSelectedIndexTraction(i)}
            >
              <Image source={opt.image} style={styles.optionImage} />
              <Text style={styles.optionText}>{opt.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <Text style={styles.resultText}>
          Seleccionado: {tractionOptions[selectedIndexTraction].name}
        </Text>
      </View>

      {/* ESPECIALIDAD */}
      <View style={styles.card}>
        <Text style={styles.title}>¿Como se estaciona?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
          {wheelOptions.map((opt, i) => (
            <Pressable
              key={opt.name}
              style={[
                styles.optionCard,
                selectedIndexWheel === i && styles.optionSelected,
              ]}
              onPress={() => setSelectedIndexWheel(i)}
            >
              <Image source={opt.image} style={styles.optionImage} />
              <Text style={styles.optionText}>{opt.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <Text style={styles.resultText}>
          Seleccionado: {wheelOptions[selectedIndexWheel].name}
        </Text>
      </View>

      {/* DATOS E IMAGEN ROBOT */}
      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Número de equipo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa número"
            keyboardType="numeric"
            value={teamNumber}
            onChangeText={setTeamNumber}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>No. de baterías</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa número"
            keyboardType="numeric"
            value={batteryNumber}
            onChangeText={setBatteryNumber}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>¿Cuanto tarda en hacer un ciclo?</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa número"
            keyboardType="numeric"
            value={clycleNumber}
            onChangeText={setCycleNumber}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>¿Pelotas por ciclo?</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa número"
            keyboardType="numeric"
            value={artifactsNumber}
            onChangeText={setartifactsNumber}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>¿Tienes autonomo?</Text>
          <View style={styles.checkContainer}>
                <CheckCircle label="Sí" selected={check1 === "Sí"} onPress={() => setCheck1("Sí")} />
                <CheckCircle label="No" selected={check1 === "No"} onPress={() => setCheck1("No")} />
              </View>
        </View>


        <Pressable style={styles.uploadButton} onPress={() => pickAvatar("selected")}>
          <Text style={styles.uploadText}>Subir imagen del robot</Text>
        </Pressable>
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        )}
      </View>

      {/* ESTRATEGIA */}
      <View style={styles.card}>
        <Text style={styles.title}>Estrategia</Text>
        <View style={styles.strategySection}>
          <View style={styles.left}>
            <Pressable style={styles.uploadButton} onPress={() => pickAvatar("strategy")}>
              <Text style={styles.uploadText}>Imagen de estrategia</Text>
            </Pressable>
            {strategyImage && (
              <Image source={{ uri: strategyImage }} style={styles.previewImage} />
            )}
          </View>

          <View style={styles.right}>
            <TextInput
              style={styles.commentBox}
              multiline
              placeholder="Describe la estrategia..."
              value={strategyComment}
              onChangeText={setStrategyComment}
            />
          </View>
        </View>
      </View>

      {/* BOTÓN ENVIAR */}
      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Enviar</Text>
      </Pressable>

      {/* MODAL */}
      <Modal visible={visiblePit} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            {pitOptions.map((opt) => (
              <Pressable
                key={opt}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedPit(opt);
                  setVisiblePit(false);
                }}
              >
                <Text style={styles.modalText}>{opt}</Text>
              </Pressable>
            ))}
            <Pressable onPress={() => setVisiblePit(false)}>
              <Text style={styles.modalCancel}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#c8b3a6",
    padding: 20,
  },
  checkLabel: {
    fontSize: 15,
    color: "#5a3e36",
    fontWeight: "500",
  },
  header: {
    fontSize: 32,
    fontWeight: "900",
    color: "#201c1bff",
    textAlign: "center",
    marginBottom: 25,
    marginTop:30,
  }, checkContainer: {
    flexDirection: "row",
    gap: 12,
  },
  checkOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  circleSelected: {
    borderColor: "#8B5E3C",
  },
  circleUnselected: {
    borderColor: "#5a3e36",
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#8B5E3C",
  },
  card: {
    backgroundColor: "#fffaf5",
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5a3e36",
    marginBottom: 15,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { fontSize: 18, fontWeight: "bold", color: "#5a3e36" },
  button: {
    backgroundColor: "#8B5E3C",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  scrollRow: { gap: 10 },
  optionCard: {
    backgroundColor: "#f1e3d6",
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
  },
  optionSelected: {
    borderColor: "#8B5E3C",
    borderWidth: 2,
    backgroundColor: "#e0c6b8",
  },
  optionImage: { width: 80, height: 80 },
  optionText: { fontSize: 14, fontWeight: "bold", marginTop: 5, color: "#5a3e36" },
  resultText: { textAlign: "center", marginTop: 10, fontStyle: "italic", color: "#444" },
  inputGroup: { flexDirection: "row", alignItems: "center", marginBottom: 12, justifyContent: "space-between" },
  inputLabel: { fontSize: 16, fontWeight: "600", color: "#5a3e36" },
  input: {
    borderWidth: 1,
    borderColor: "#bfa193",
    borderRadius: 8,
    padding: 8,
    width: 150,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  uploadButton: {
    backgroundColor: "#8B5E3C",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 10,
  },
  uploadText: { color: "#fff", fontWeight: "bold" },
  previewImage: { width: 150, height: 150, marginTop: 10, borderRadius: 10 },
  strategySection: { flexDirection: "row", gap: 10 },
  left: { flex: 1, alignItems: "center" },
  right: { flex: 1 },
  commentBox: {
    borderWidth: 1,
    borderColor: "#bfa193",
    borderRadius: 10,
    padding: 10,
    height: 160,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#5a3e36",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 40,
  },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fffaf5",
    borderRadius: 15,
    width: "80%",
    padding: 20,
  },
  modalOption: {
    backgroundColor: "#8B5E3C",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  modalCancel: {
    color: "#8B5E3C",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },
});

export default App;
