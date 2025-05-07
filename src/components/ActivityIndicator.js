import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingIndicator = ({ size = 'large', color = '#6200EE', style }) => (
  <View style={[styles.container, style]}>
    <ActivityIndicator style={styles.indicator} size={size} color={color} />
  </View>
);

const styles = StyleSheet.create({
  container: {

    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    position:'absolute',
    left:0,
    right:0,
    top:0,
    bottom:0,
    
  },
 
});

export default LoadingIndicator;
