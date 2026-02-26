import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Image } from 'react-native';

const InitialLoading = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={{
            uri: 'https://dli6r6oycdqaz.cloudfront.net/college-36/user-109260/30c39e6db4a149f89b6fd7f01e0cdde9_20210608_132206_36_109260_SUG_logo.png',
          }}
          style={styles.logo}
        />

        <ActivityIndicator size="large" color="#5e46b4" />

        <Text style={styles.text}>Loading your saved data...</Text>
        <Text style={styles.subText}>Please wait</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    alignItems: 'center',
  },

  logo: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
    marginBottom: 25,
  },

  text: {
    marginTop: 20,
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },

  subText: {
    marginTop: 6,
    fontSize: 14,
    color: '#777',
  },
});

export default InitialLoading;