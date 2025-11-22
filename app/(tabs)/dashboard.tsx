import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal, Pressable, ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// --- Tipos TypeScript ---
export interface TeamStats {
  alliance_score: number;
  auto_in: number;
  ftc_rank: number | null;
  score: number;
  score_list: number[];
  team_number: string;
  teleop_in: number;
}

type DatoOpcion = {
  numero: number;
  nombre: string;
  califValor: number;
  masInfo: string;
  delta: boolean;
};

// --- Componente de Estrellas Interactivas ---
const StarRating: React.FC<{ rating: number; setRating: (r: number) => void }> = ({
  rating,
  setRating,
}) => {
  return (
    <View style={styles.califContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)}>
          <Text
            style={[
              styles.star,
              { color: star <= rating ? "#ffa500" : "#ccc" },
            ]}
          >
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// --- Tablas ---
const TablaResumen: React.FC<{ datos?: TeamStats[] }> = ({ datos = [] }) => {
  // 1. Crear una copia del array y ordenarlo antes de renderizar
  const sortedDatos = [...datos].sort((a, b) => {
    // --- Criterio de ordenamiento ---

    // Criterio Principal: ftc_rank (ascendente, 1 es el mejor)
    const rankA = a.ftc_rank ?? Infinity; // Si no hay rango, tratarlo como el peor posible
    const rankB = b.ftc_rank ?? Infinity;

    if (rankA !== rankB) {
      // Si los rangos son diferentes, ordenar por rango
      return rankA - rankB;
    }

    // Criterio Secundario (si los rangos son iguales): score_list[0] (descendente)
    const scoreA = a.score_list?.[0] ?? -Infinity; // Si no hay score, tratarlo como el peor posible
    const scoreB = b.score_list?.[0] ?? -Infinity;

    // Ordenar por score de mayor a menor
    return scoreB - scoreA;
  });

  return (
    <View style={styles.tablaContainer}>
      <Text style={styles.tablaTitle}>Equipos</Text>

      <ScrollView horizontal>
        <View>
          {/* Encabezados */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, { width: 120 }]}>Puntaje</Text>
            <Text style={[styles.tableHeader, { width: 120 }]}>Puntaje Alianza</Text>
            <Text style={[styles.tableHeader, { width: 120 }]}>Equipo</Text>
            <Text style={[styles.tableHeader, { width: 100 }]}>Ranking</Text>
            
            <Text style={[styles.tableHeader, { width: 80 }]}>Autónomo</Text>
            <Text style={[styles.tableHeader, { width: 80 }]}>Teleop</Text>
          </View>

          {/* Filas de datos usando el array ordenado */}
          {sortedDatos.map((item) => (
            // 2. Usar un ID único como key (como team_number) es mejor que el índice
            <View key={item.team_number ?? Math.random()} style={styles.tableRow}>
                 <Text style={[styles.tableCell, { width: 120 }]}>
                {item.score_list?.[0] ?? "-"}
              </Text>

              <Text style={[styles.tableCell, { width: 120 }]}>
                {item.alliance_score ?? "-"}
              </Text>
              <Text style={[styles.tableCell, { width: 120 }]}>
                {item.team_number ?? "-"}
              </Text>

              <Text style={[styles.tableCell, { width: 100 }]}>
                {item.ftc_rank ?? "-"}
              </Text>

           

              <Text style={[styles.tableCell, { width: 80 }]}>
                {item.auto_in ?? "-"}
              </Text>

              <Text style={[styles.tableCell, { width: 80 }]}>
                {item.teleop_in ?? "-"}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};


// --- Dashboard Principal ---
const DashboardScreen: React.FC = () => {
  const [datosResumen, setDatosResumen] = useState<TeamStats[]>([]);
  const [datosOpciones, setDatosOpciones] = useState<DatoOpcion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRegional, setSelectedRegional] = useState("CDMX");
  const [visiblePit, setVisiblePit] = useState(false);
   const regionales = ["CDMX", "Cuautitlán", "Toluca"];
   type Regional = typeof regionales[number];
  const regionalCodes: Record<Regional, string> = {
  CDMX: "MXTLQ",
  Cuautitlán: "MXCIQ",
  Toluca: "MXTLG"
};const cargarDatos = async (selectedRegional: Regional) => {
  setLoading(true);

  const codigoRegional = regionalCodes[selectedRegional];
  console.log(codigoRegional);
  
  try {
    const response = await fetch(
      "https://flask-hello-worldsadsadsdasad.vercel.app/ranking",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventCode: codigoRegional,
        }),
      }
    );

    if (!response.ok) throw new Error("Error al cargar datos");
    const data = await response.json();
    console.log(data);
    setDatosResumen(data);

  } catch (error) {
    console.error(error);
    alert("No se pudieron cargar los datos");
  } finally {
    setLoading(false);
  }
};


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard de Calificaciones</Text>
  <Pressable style={styles.button} onPress={() => setVisiblePit(true)}>
              <Text style={styles.buttonText}>{selectedRegional}</Text>
            </Pressable>
      <TouchableOpacity style={styles.cargarButton} onPress={() => cargarDatos(selectedRegional)}>
        <Text style={styles.cargarButtonText}>Cargar Datos</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size="large" color="#6F4E37" style={{ marginVertical: 20 }} />
      )}

      <TablaResumen datos={datosResumen} />
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

export default DashboardScreen;

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F2EB",
    padding: 20,
  },button: {
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
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3E2723",
    textAlign: "center",
    marginBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
  cargarButton: {
    backgroundColor: "#6F4E37",
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  cargarButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  tablaContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tablaTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
  },
  tableHeader: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 12,
    textTransform: "uppercase",
  },
  tableCell: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  califContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    fontSize: 20,
    marginHorizontal: 2,
  },
  masButton: {
    backgroundColor: "#6F4E37",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  masButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
