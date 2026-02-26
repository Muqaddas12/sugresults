import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const LoadingIndicator = ({ 
  size = 'large', 
  color = '#6200EE', 
  style,
  message = 'Please wait while we are loading your result...'
}) => (
  <View style={[styles.container, style]}>
    <View style={styles.box}>
      <ActivityIndicator size={size} color={color} />
      <Text style={styles.text}>{message}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)', // semi transparent overlay
  },

  box: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  text: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

export default LoadingIndicator;