import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Platform } from 'react-native';
import Logo from '@/components/logo';

const LoadingIndicator = ({
  size = 'large',
  color = '#4338CA',
  style,
  message = 'Loading provisional grade sheet...',
}) => (
  <View style={[styles.container, style]}>
    <View style={styles.card}>
      <View style={styles.logoBadge}>
        <Logo size={44} />
      </View>
      <ActivityIndicator size={size} color={color} style={styles.spinner} />
      <Text style={styles.title}>Shobhit University</Text>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.footerNote}>
        <Text style={styles.footerNoteText}>Secure Examination Server</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    zIndex: 9999,
  },
  card: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 26,
    paddingHorizontal: 28,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    width: '84%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#4338CA',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  spinner: {
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  footerNote: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  footerNoteText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4338CA',
    letterSpacing: 0.2,
  },
});

export default LoadingIndicator;