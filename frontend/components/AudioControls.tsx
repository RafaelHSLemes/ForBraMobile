// AudioControls.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface AudioControlsProps {
  onToggleMute: () => void;
  isMuted: boolean;
}

const AudioControls: React.FC<AudioControlsProps> = ({ onToggleMute, isMuted }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        testID="mute-button" // Atribui o testID para ser usado nos testes
        onPress={onToggleMute}
        style={[
          styles.button,
          { backgroundColor: isMuted ? '#32CD32' : '#FFD700' }, // Define a cor com base no estado isMuted
        ]}
      >
        <Text style={styles.buttonText}>
          {isMuted ? 'Desmutar' : 'Mutar'} {/* Alterna o texto com base no estado */}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default AudioControls;