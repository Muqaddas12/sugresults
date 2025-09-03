import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import FileViewer from 'react-native-file-viewer';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomBar from '../src/components/BottomBar';

const Downloads = () => {
  const [files, setFiles] = useState([]);

  // Fetch downloaded PDFs
  const fetchFiles = async () => {
    try {
      const downloadsDir = `${RNFS.DownloadDirectoryPath}/sugresults`;

      const exists = await RNFS.exists(downloadsDir);
      if (!exists) {
        setFiles([]);
        return;
      }

      const result = await RNFS.readDir(downloadsDir);

      const pdfFiles = result
        .filter(item => item.isFile() && item.name.endsWith('.pdf'))
        .map(item => ({
          name: item.name,
          path: item.path,
          size: (item.size / 1024).toFixed(1), // KB
          modified: new Date(item.mtime).toLocaleDateString(),
        }));

      setFiles(pdfFiles);
    } catch (err) {
      console.error('Error reading files:', err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // 📂 Open File
  const openFile = async (path) => {
    try {
      await FileViewer.open(path, { showOpenWithDialog: true });
    } catch (err) {
      console.log('Error opening file:', err);
      Alert.alert('Error', 'Could not open file.');
    }
  };

  // 📤 Share File
  const shareFile = async (path) => {
    try {
      await Share.open({
        title: 'Share PDF',
        url: 'file://' + path,
        type: 'application/pdf',
      });
    } catch (err) {
      if (err?.message !== 'User did not share') {
        console.log('Error sharing file:', err);
        Alert.alert('Error', 'Could not share file.');
      }
    }
  };

  // 🗑 Delete File
  const deleteFile = async (path) => {
    try {
      await RNFS.unlink(path);
      Alert.alert('Deleted', 'File removed successfully.');
      fetchFiles(); // refresh list
    } catch (err) {
      console.log('Error deleting file:', err);
      Alert.alert('Error', 'Could not delete file.');
    }
  };
  // 🗑 Delete File with confirmation
const confirmDelete = (path) => {
  Alert.alert(
    "Delete File",
    "Are you sure you want to delete this file?",
    [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          try {
            await RNFS.unlink(path);
            Alert.alert("Deleted", "File removed successfully.");
            fetchFiles(); // refresh list
          } catch (err) {
            console.log("Error deleting file:", err);
            Alert.alert("Error", "Could not delete file.");
          }
        } 
      }
    ]
  );
};


  const renderItem = ({ item }) => (
    <View style={styles.fileCard}>
      <TouchableOpacity style={styles.fileInfo} onPress={() => openFile(item.path)}>
        <Icon name="document-text-outline" size={30} color="#5e46b4" style={styles.fileIcon} />
        <View>
          <Text style={styles.fileName}>{item.name}</Text>
          <Text style={styles.fileMeta}>
            {item.size} KB • {item.modified}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => shareFile(item.path)} style={styles.actionBtn}>
          <Icon name="share-social-outline" size={22} color="#4caf50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmDelete(item.path)} style={styles.actionBtn}>
  <Icon name="trash-outline" size={22} color="#e53935" />
</TouchableOpacity>

      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📥 Downloads</Text>

      {files.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="folder-open-outline" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No files found</Text>
        </View>
      ) : (
        <FlatList
          data={files}
          keyExtractor={(item) => item.path}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Bottom Bar */}
      <BottomBar currentPage="Downloads" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5e46b4',
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 80, // space for bottom bar
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f8ff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 3,
    justifyContent: 'space-between',
  },
  fileIcon: {
    marginRight: 12,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  fileMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    marginLeft: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 8,
  },
});

export default Downloads;
