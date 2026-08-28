import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

export default function Downloads() {
  const insets = useSafeAreaInsets();
  const [files, setFiles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getDownloadsDir = () => {
    return `${FileSystem.documentDirectory}sugresults/`;
  };

  // Fetch downloaded PDFs
  const fetchFiles = useCallback(async () => {
    try {
      const dir = getDownloadsDir();
      const dirInfo = await FileSystem.getInfoAsync(dir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
        setFiles([]);
        return;
      }

      const fileNames = await FileSystem.readDirectoryAsync(dir);
      const pdfNames = fileNames.filter((name) => name.toLowerCase().endsWith('.pdf'));

      const fileDetails = await Promise.all(
        pdfNames.map(async (name) => {
          const filePath = `${dir}${name}`;
          const info = await FileSystem.getInfoAsync(filePath);
          return {
            name,
            path: filePath,
            size: info.exists && info.size ? (info.size / 1024).toFixed(1) : '0.0',
            modified:
              info.exists && info.modificationTime
                ? new Date(info.modificationTime * 1000).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Recent',
          };
        })
      );

      setFiles(fileDetails.reverse());
    } catch (err) {
      console.log('Error reading files:', err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFiles();
    }, [fetchFiles])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFiles();
    setRefreshing(false);
  };

  // Open / View File
  const openFile = async (path) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(path, {
          mimeType: 'application/pdf',
          dialogTitle: 'View / Share Grade Sheet',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('Grade Sheet Saved', `Location: ${path}`);
      }
    } catch (err) {
      console.log('Error opening file:', err);
      Alert.alert('Error', 'Could not open PDF file.');
    }
  };

  // Share File
  const shareFile = async (path) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Sharing.shareAsync(path, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Grade Sheet PDF',
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      console.log('Error sharing file:', error);
    }
  };

  // Delete File with confirmation
  const confirmDelete = (path, name) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Delete Grade Sheet',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await FileSystem.deleteAsync(path, { idempotent: true });
              fetchFiles();
            } catch (err) {
              console.log('Error deleting file:', err);
              Alert.alert('Error', 'Could not delete file.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.fileCard}>
      <TouchableOpacity
        style={styles.fileMainTouch}
        activeOpacity={0.7}
        onPress={() => openFile(item.path)}
      >
        <View style={styles.pdfBadgeCircle}>
          <Ionicons name="document-text" size={22} color="#EF4444" />
          <View style={styles.pdfPill}>
            <Text style={styles.pdfPillText}>PDF</Text>
          </View>
        </View>

        <View style={styles.fileDetails}>
          <Text style={styles.fileName} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.fileMetaText}>
              {item.size} KB • {item.modified}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionCircleBtn}
          onPress={() => openFile(item.path)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="eye-outline" size={19} color="#4338CA" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCircleBtn}
          onPress={() => shareFile(item.path)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="share-social-outline" size={19} color="#10B981" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCircleBtn, styles.deleteActionCircle]}
          onPress={() => confirmDelete(item.path, item.name)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="trash-outline" size={19} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 16) + 4,
        },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleRow}>
          <View style={styles.headerIconWrapper}>
            <Ionicons name="download" size={20} color="#4338CA" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Downloaded Results</Text>
            <Text style={styles.headerSubtitle}>Offline Grade Sheet PDFs</Text>
          </View>
        </View>
        {files.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{files.length} Saved</Text>
          </View>
        )}
      </View>

      {files.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="folder-open-outline" size={54} color="#94A3B8" />
          </View>
          <Text style={styles.emptyTitle}>No Saved Grade Sheets</Text>
          <Text style={styles.emptySubtitle}>
            Downloaded grade sheet PDFs will appear here for instant offline access and sharing.
          </Text>
          <TouchableOpacity
            style={styles.checkResultButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Ionicons name="search-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.checkResultButtonText}>Check Your Result</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={files}
          keyExtractor={(item) => item.path}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  countBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4338CA',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  fileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  fileMainTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pdfBadgeCircle: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    position: 'relative',
  },
  pdfPill: {
    position: 'absolute',
    bottom: -3,
    backgroundColor: '#EF4444',
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  pdfPillText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileMetaText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    gap: 10,
  },
  actionCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  deleteActionCircle: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  checkResultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4338CA',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#4338CA',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  checkResultButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

