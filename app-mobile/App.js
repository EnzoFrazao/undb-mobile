import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Header from './components/Header';

export default function App() {
  return (
    <View style={styles.container}>
      <Header title="App Mobile" />
      <View style={styles.content}>
        <Text style={styles.text}>
          Projeto iniciado. Novos componentes vao em components/, cada um com
          index.js e styles.js.
        </Text>
      </View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#3C3C4399',
  },
});
