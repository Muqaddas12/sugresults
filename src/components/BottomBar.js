import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { router } from 'expo-router';

const BottomBar = ({ currentPage }) => {
  const TabItem = ({ label, icon, route }) => {
    const isActive = currentPage === label;

    const content = (
      <>
        <Icon
          name={icon}
          size={24}
          color={isActive ? '#5e46b4' : 'gray'}
        />
        <Text style={[styles.label, isActive && styles.active]}>
          {label}
        </Text>
      </>
    );

    // If active, show plain View (no navigation)
    if (isActive) {
      return <View style={styles.tab}>{content}</View>;
    }

    // If not active, make it pressable
    return (
      <TouchableOpacity
        style={styles.tab}
        onPress={() => router.push(route)}
      >
        {content}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TabItem label="Home" icon="home-outline" route="/" />
      <TabItem label="Downloads" icon="download-outline" route="/downloads" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
  },
  tab: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
  active: {
    color: '#5e46b4',
    fontWeight: '600',
  },
});

export default BottomBar;
