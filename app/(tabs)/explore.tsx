import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image, Modal, Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

const App: React.FC = () => {
  const [teamNumber, setTeamNumber] = useState("");
  const [matchNumber, setMatchNumber] = useState("");
  const [selectedRegional, setSelectedRegional] = useState("CDMX");
  const [robotRating, setRobotRating] = useState(0);
  const [driverRating, setDriverRating] = useState(0);
  const [generalRating, setGeneralRating] = useState(0);
  const [commentrobot, setCommentrobot] = useState("");
  const [commentdriver, setCommentdriver] = useState("");
  const [comment, setComment] = useState("");

  const [visiblePit, setVisiblePit] = useState(false);
  const [count2auto, setCount2auto] = useState(0);
  const [count2teleop, setCount2teleop] = useState(0);
  const [count2endgame, setCount2endgame] = useState(0);
  const [count3endgame, setCount3endgame] = useState(0);

  const [count3auto, setCount3auto] = useState(0);
  const [count3teleop, setCount3teleop] = useState(0);
  const [countmottif, setcountmottif] = useState(0);
  const [countrp, setCountrp] = useState(0);

  const [check1, setCheck1] = useState<"Sí" | "No" | null>(null);
  const [check2, setCheck2] = useState<"Sí" | "No" | null>(null);
  const [check3, setCheck3] = useState<"Sí" | "No" | null>(null);
  const [check4, setCheck4] = useState<"Sí" | "No" | null>(null);
  const [checkinicio, setCheckinicio] = useState<"Sí" | "No" | null>(null);
  const regionales = ["CDMX", "Cuautitlán", "Toluca"];

  const StarRating = ({
    rating,
    setRating,
  }: {
    rating: number;
    setRating: (r: number) => void;
  }) => (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Pressable key={i} onPress={() => setRating(i)}>
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={30}
            color="#DDA15E"
          />
        </Pressable>
      ))}
    </View>
  );
  const enviardatos = async () => {
  // Crear objeto con los datos del match
  const matchData = {
    team_number: teamNumber,
    match_number: matchNumber,
    regional: selectedRegional,
    // Autonomo
    check_inicio: checkinicio,
    count_mottif: countmottif,
    count_in_cage_auto: count2auto,
    count_out_cage_auto: count3auto,
    // Teleop
    count_in_cage_teleop: count2teleop,
    count_out_cage_teleop: count3teleop,
    count_rp: countrp,
    // Endgame
    check_scoring: check1,
    count_in_cage_endgame: count2endgame,
    count_out_cage_endgame: count3endgame,
    check_full_park: check2,
    check_partial_park: check3,
    check_high: check4,
    // Calificaciones y comentarios
    robot_rating: robotRating,
    comment_robot: commentrobot,
    driver_rating: driverRating,
    comment_driver: commentdriver,
    general_rating: generalRating,
    comment_general: comment
  };

  console.log("Enviando match:", matchData);

  try {
    const response = await fetch("https://scoutbueno.vercel.app/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(matchData)
    });

    if (!response.ok) {
      throw new Error("Error al enviar los datos del match");
    }

    const result = await response.json();
    console.log("Datos enviados correctamente:", result);

  } catch (error) {
    console.error("Error enviando match:", error);
  }
};

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* TITULO PRINCIPAL */}
      <Text style={styles.header}>Match</Text>

<View style={styles.card}>

  {/* 🟧 Título dentro de la card */}
  <Text style={styles.cardTitle}>General</Text>

 

  {/* No. Equipo y No. Match */}
  <View style={styles.rowColumn}>
    <View style={styles.inputBlock}>
      <Text style={styles.label}>No. Equipo</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={teamNumber}
        onChangeText={setTeamNumber}
      />
    </View>

    <View style={styles.inputBlock}>
      <Text style={styles.label}>No. Match</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={matchNumber}
        onChangeText={setMatchNumber}
      />
    </View>
  </View>

  {/* Picker Regional */}
  <Pressable style={styles.button} onPress={() => setVisiblePit(true)}>
              <Text style={styles.buttonText}>{selectedRegional}</Text>
            </Pressable>

</View>
{/* 🟦 CARD */}
<View style={styles.card}>

  {/* 🟧 Título interno */}
  <Text style={styles.cardTitle}>Autonomus</Text>

  {/* ¿Inicio? */}
  <View style={styles.imageRow}>
    <Text style={styles.imageTitle}>¿Inicio?</Text>
    <View style={styles.checkContainer}>
      <CheckCircle label="Sí" selected={checkinicio === "Sí"} onPress={() => setCheckinicio("Sí")} />
      <CheckCircle label="No" selected={checkinicio === "No"} onPress={() => setCheckinicio("No")} />
    </View>
  </View>


  {/* Logro QR */}
  <View style={styles.imageCounterRow}>
    <Pressable onPress={() => setcountmottif(countmottif + 1)}>
      <Image source={require("../../assets/images/logroqr.jpg")} style={styles.counterImage} />
    </Pressable>
    <Text style={styles.counterLabel}>Mottif Points</Text>
    <Text style={styles.counterNumber}>{countmottif}</Text>
  </View>

  {/* In Cage Autónomo */}
  <View style={styles.imageCounterRow}>
    <Pressable onPress={() => setCount2auto(count2auto + 1)}>
      <Image source={require("../../assets/images/sidentro.jpg")} style={styles.counterImage} />
    </Pressable>
    <Text style={styles.counterLabel}>In Cage</Text>
    <Text style={styles.counterNumber}>{count2auto}</Text>
  </View>

  {/* Out Cage Autónomo */}
  <View style={styles.imageCounterRow}>
    <Pressable onPress={() => setCount3auto(count3auto + 1)}>
      <Image source={require("../../assets/images/solopaso.jpg")} style={styles.counterImage} />
    </Pressable>
    <Text style={styles.counterLabel}>Out Cage</Text>
    <Text style={styles.counterNumber}>{count3auto}</Text>
  </View>

</View>

{/* 🟦 CARD */}
<View style={styles.card}>

  {/* 🟧 Título interno */}
  <Text style={styles.cardTitle}>Teleop</Text>

  <View style={styles.imageCounterRow}>
    <Pressable onPress={() => setCount2teleop(count2teleop + 1)}>
      <Image source={require("../../assets/images/sidentro.jpg")} style={styles.counterImage} />
    </Pressable>
    <Text style={styles.counterLabel}>In Cage</Text>
    <Text style={styles.counterNumber}>{count2teleop}</Text>
  </View>

  <View style={styles.imageCounterRow}>
    <Pressable onPress={() => setCount3teleop(count3teleop + 1)}>
      <Image source={require("../../assets/images/solopaso.jpg")} style={styles.counterImage} />
    </Pressable>
    <Text style={styles.counterLabel}>Out Cage</Text>
    <Text style={styles.counterNumber}>{count3teleop}</Text>
  </View>

</View>

{/* 🟦 CARD */}
<View style={styles.card}>

  {/* 🟧 Título interno */}
  <Text style={styles.cardTitle}>End Game</Text>

  {/* ¿Continuó metiendo puntos? */}
  <View style={styles.imageRow}>
    <Text style={styles.imageTitle}>¿Continuó scoring?</Text>
    <View style={styles.checkContainer}>
      <CheckCircle label="Sí" selected={check1 === "Sí"} onPress={() => setCheck1("Sí")} />
      <CheckCircle label="No" selected={check1 === "No"} onPress={() => setCheck1("No")} />
    </View>
  </View>

{/* SI check1 ES "Sí", MOSTRAR OTRA VISTA */}
{check1 === "Sí" && (
  <View >
  
  <View style={styles.imageCounterRow}>
    <Pressable onPress={() => setCount2endgame(count2endgame + 1)}>
      <Image source={require("../../assets/images/sidentro.jpg")} style={styles.counterImage} />
    </Pressable>
    <Text style={styles.counterLabel}>In Cage</Text>
    <Text style={styles.counterNumber}>{count2endgame}</Text>
  </View>

  <View style={styles.imageCounterRow}>
    <Pressable onPress={() => setCount3endgame(count3endgame + 1)}>
      <Image source={require("../../assets/images/solopaso.jpg")} style={styles.counterImage} />
    </Pressable>
    <Text style={styles.counterLabel}>Out Cage</Text>
    <Text style={styles.counterNumber}>{count3endgame}</Text>
  </View>
  </View>
)}
  {/* Full estacionado */}
  <View style={styles.imageRow}>
    <Image source={require("../../assets/images/siesta.jpg")} style={styles.imagesino} />
    <Text style={styles.imageTitle}>Full estacionado</Text>
    <View style={styles.checkContainer}>
      <CheckCircle label="Sí" selected={check2 === "Sí"} onPress={() => setCheck2("Sí")} />
      <CheckCircle label="No" selected={check2 === "No"} onPress={() => setCheck2("No")} />
    </View>
  </View>

  {/* Parcial estacionado */}
  <View style={styles.imageRow}>
    <Image source={require("../../assets/images/malestacionado.jpg")} style={styles.imagesino} />
    <Text style={styles.imageTitle}>Parcial estacionado</Text>
    <View style={styles.checkContainer}>
      <CheckCircle label="Sí" selected={check3 === "Sí"} onPress={() => setCheck3("Sí")} />
      <CheckCircle label="No" selected={check3 === "No"} onPress={() => setCheck3("No")} />
    </View>
  </View>

  {/* ¿Se elevó? */}
  <View style={styles.imageRow}>
    <Text style={styles.imageTitle}>¿Se elevó?</Text>
    <View style={styles.checkContainer}>
      <CheckCircle label="Sí" selected={check4 === "Sí"} onPress={() => setCheck4("Sí")} />
      <CheckCircle label="No" selected={check4 === "No"} onPress={() => setCheck4("No")} />
    </View>
  </View>
<View style={styles.imageCounterRow}>
    <Pressable onPress={() => setCountrp(countrp + 1)}>
      <Image source={require("../../assets/images/rp.jpg")} style={styles.counterImage} />
    </Pressable>
    <Text style={styles.counterLabel}>Ranking Points</Text>
    <Text style={styles.counterNumber}>{countrp}</Text>
  </View>
</View>

{/* 🟦 CARD */}
<View style={styles.card}>

  {/* 🟧 Título interno */}
  <Text style={styles.cardTitle}>Calificaciones</Text>

  {/* ⭐ Robot */}
  <Text style={styles.ratingLabel}>Robot</Text>
  <StarRating rating={robotRating} setRating={setRobotRating} />
  <TextInput
    style={styles.commentBox2}
    placeholder="Comentarios del robot..."
    value={commentrobot}
    onChangeText={setCommentrobot}
  />

  {/* ⭐ Driver */}
  <Text style={styles.ratingLabel}>Driver</Text>
  <StarRating rating={driverRating} setRating={setDriverRating} />
  <TextInput
    style={styles.commentBox2}
    placeholder="Comentarios del driver..."
    value={commentdriver}
    onChangeText={setCommentdriver}
  />

  {/* ⭐ Calificación General */}
  <Text style={styles.sectionTitle}>Calificación General</Text>
  <StarRating rating={generalRating} setRating={setGeneralRating} />

  {/* 📝 Comentarios Generales */}
  <Text style={styles.sectionTitle}>Comentarios Generales</Text>
  <TextInput
    style={styles.commentBox}
    placeholder="Escribe tus comentarios..."
    value={comment}
    onChangeText={setComment}
  />

  {/* BOTÓN ENVIAR */}
  <Pressable style={styles.button} onPress={enviardatos}>
    <Text style={styles.buttonText}>Enviar</Text>
  </Pressable>

</View>
 {/* MODAL */}
      <Modal visible={visiblePit} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            {regionales.map((opt) => (
              <Pressable
                key={opt}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedRegional(opt);
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
    backgroundColor: "#c8b3a6",
    alignItems: "center",
    padding: 20,
  },card:{
    alignContent: "center",
    alignItems: "center",

    justifyContent: "center",
    width: "100%",
    marginBottom: 15,
    backgroundColor: "#ffffffff",
    borderRadius: 15,
    padding: 15,
  },cardTitle: {
  fontSize: 20,
  fontWeight: "700",
  color: "#5a3e36",
  marginBottom: 15,
  textAlign: "center",
},
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#5a3e36",
    textAlign: "center",
    alignSelf: "center",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#5a3e36",
    marginVertical: 10,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    width: "90%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  icon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 42,
    fontSize: 16,
  },
  rowColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  inputBlock: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerContainer: {
    width: "90%",
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: "#5a3e36",
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#5a3e36",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  imageBlock: {
    width: "90%",
    alignItems: "center",
    marginBottom: 25,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 20,
    gap: 20,
    backgroundColor: "#bfa193",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    width: "99%",
  },
  image: {
    width: 70,
    height: 70,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  imagesino: {
    width: 30,
    height: 30,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffffff",
    width: 120,
    textAlign: "center",
  },
  counterText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5a3e36",
    marginTop: 5,
  },
  checkContainer: {
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
  checkLabel: {
    fontSize: 15,
    color: "#5a3e36",
    fontWeight: "500",
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
  },
  generalRating: {
    marginVertical: 20,
    alignItems: "center",
  },
  ratingLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#5a3e36",
    textAlign: "center",
    marginBottom: 5,
  },
  commentBox: {
    width: "90%",
    height: 100,
    borderWidth: 1,
    borderColor: "#5a3e36",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    textAlignVertical: "top",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  commentBox2: {
    width: "90%",
    height: 70,
    borderWidth: 1,
    borderColor: "#5a3e36",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    textAlignVertical: "top",
    marginBottom: 20,
    marginTop: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: "#8B5E3C",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 12,
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    
  },
  imageCounterRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#bfa193",
  padding: 12,
  borderRadius: 12,
  width: "90%",
  marginBottom: 15,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 2,
},
counterImage: {
  width: 60,
  height: 60,
  borderRadius: 10,
  backgroundColor: "#f5f5f5",
},
counterLabel: {
  fontSize: 16,
  fontWeight: "600",
  color: "#ffffffff",
  textAlign: "center",
  flex: 1,
},
counterNumber: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#8B5E3C",
  width: 40,
  textAlign: "center",
},  modalContainer: {
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