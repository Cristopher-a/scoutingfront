import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// --- Tipos TypeScript ---
type DatoResumen = {
  delta: boolean;
  califValor: number;
  nombre: string;
  masInfo: string;
};

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
const TablaResumen: React.FC<{ datos?: DatoResumen[] }> = ({ datos = [] }) => {
  const [ratings, setRatings] = useState<number[]>(datos.map((d) => d.califValor));

  return (
    <View style={styles.tablaContainer}>
      <Text style={styles.tablaTitle}>Mejores Equipos</Text>
      <ScrollView horizontal>
        <View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, { width: 120 }]}>Número</Text>
            <Text style={[styles.tableHeader, { width: 100 }]}>Nombre</Text>
            <Text style={[styles.tableHeader, { width: 120 }]}>Calificación</Text>
            <Text style={[styles.tableHeader, { width: 80 }]}>Más</Text>
          </View>

          {datos.map((item, index) => (
            <View key={`${item.nombre}-${index}`} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: 120 }]}>0000</Text>
              <Text style={[styles.tableCell, { width: 100 }]}>{item.nombre}</Text>

              <View style={[styles.tableCell, { width: 120 }]}>
                <StarRating
                  rating={ratings[index]}
                  setRating={(newRating) => {
                    const newRatings = [...ratings];
                    newRatings[index] = newRating;
                    setRatings(newRatings);
                  }}
                />
              </View>

              <TouchableOpacity
                style={[styles.masButton, { width: 80 }]}
                onPress={() =>
                  Alert.alert(item.nombre, item.masInfo || "No hay información adicional")
                }
              >
                <Text style={styles.masButtonText}>Ver más</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const TablaOpciones: React.FC<{ datos?: DatoOpcion[] }> = ({ datos = [] }) => {
  const [ratings, setRatings] = useState<number[]>(datos.map((d) => d.califValor));

  return (
    <View style={styles.tablaContainer}>
      <Text style={styles.tablaTitle}>Otros Equipos</Text>
      <ScrollView horizontal>
        <View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, { width: 60 }]}>Número</Text>
            <Text style={[styles.tableHeader, { width: 100 }]}>Nombre</Text>
            <Text style={[styles.tableHeader, { width: 120 }]}>Calificación</Text>
            <Text style={[styles.tableHeader, { width: 80 }]}>Más</Text>
          </View>

          {datos.map((item, index) => (
            <View key={`${item.nombre}-${index}`} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: 60 }]}>0000</Text>
              <Text style={[styles.tableCell, { width: 100 }]}>{item.nombre}</Text>

              <View style={[styles.tableCell, { width: 120 }]}>
                <StarRating
                  rating={ratings[index]}
                  setRating={(newRating) => {
                    const newRatings = [...ratings];
                    newRatings[index] = newRating;
                    setRatings(newRatings);
                  }}
                />
              </View>

              <TouchableOpacity
                style={[styles.masButton, { width: 80 }]}
                onPress={() =>
                  Alert.alert(item.nombre, item.masInfo || "No hay información adicional")
                }
              >
                <Text style={styles.masButtonText}>Ver más</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// --- Dashboard Principal ---
const DashboardScreen: React.FC = () => {
  const [datosResumen, setDatosResumen] = useState<DatoResumen[]>([]);
  const [datosOpciones, setDatosOpciones] = useState<DatoOpcion[]>([]);
  const [loading, setLoading] = useState(false);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/dashboard");
      if (!response.ok) throw new Error("Error al cargar datos");
      const data = await response.json();

      setDatosResumen(data.resumen || []);
      setDatosOpciones(data.opciones || []);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard de Calificaciones</Text>

      <TouchableOpacity style={styles.cargarButton} onPress={cargarDatos}>
        <Text style={styles.cargarButtonText}>Cargar Datos</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size="large" color="#6F4E37" style={{ marginVertical: 20 }} />
      )}

      <TablaResumen datos={datosResumen} />
      <View style={styles.separator} />
      <TablaOpciones datos={datosOpciones} />
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
