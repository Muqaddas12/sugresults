import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  NativeModules,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

import LoadingIndicator from '@/components/ActivityIndicator';
import { logoBase64 } from '@/components/logo';
import { generatePDF } from 'react-native-html-to-pdf';

const { SaveResult } = NativeModules;

const ResultView = () => {
  const { result, rollNumber } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Loading result...');

  // Mobile Friendly Responsive CSS for Grade Sheet
  const mobileCSS = `
    <style type="text/css">
      * {
        box-sizing: border-box;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
          Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        margin: 0;
        padding: 12px;
        background-color: #F8FAFC;
        color: #0F172A;
      }

      h1, h2, h3, h4 {
        text-align: center;
        color: #1E1B4B;
        margin: 6px 0;
        letter-spacing: -0.3px;
      }

      p {
        text-align: center;
        font-size: 13px;
        color: #475569;
        margin: 4px 0;
      }

      .result-box {
        background: #FFFFFF;
        padding: 16px;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        border: 1px solid #E2E8F0;
        margin-bottom: 20px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 14px;
        margin-bottom: 14px;
        border-radius: 10px;
        overflow: hidden;
        font-size: 12px;
      }

      table th {
        background-color: #4338CA;
        color: #FFFFFF;
        padding: 8px 6px;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        border: 1px solid #3730A3;
      }

      table td {
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        padding: 7px 6px;
        text-align: center;
        font-size: 12px;
        color: #1E293B;
      }

      table tr:nth-child(even) td {
        background-color: #F8FAFC;
      }

      img {
        display: block;
        margin: 0 auto 12px auto;
        max-width: 110px;
        height: auto;
      }
    </style>
  `;

  // Clean and transform result HTML
  let newData = result?.replace('<a href=index.php>Search Another Number</a>', '');
  newData = newData?.replace(
    `<p align="center"><img src="Icon.JPG" width="100" height="100" /><img src="sug.png" width="72" height="79" align="right" /></p>`,
    `<div style="text-align:center;">
     <img src="${logoBase64}" width="110" />
   </div>`
  );
  newData = newData?.replace(
    `<img src="Icon1.JPG" width="300" height="300" /><img src="sug.png" width="72" height="79" align="right" />`,
    `<div style="text-align:center;">
     <img src="${logoBase64}" width="110" />
   </div>`
  );

  // Storage Permission
  const requestPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 30) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs storage permission to save your provisional result PDF.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Generate HTML for PDF
  const generatePdf = () => {
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${mobileCSS}
        </head>
        <body>
          <div class="result-box">
            ${newData}
          </div>
        </body>
      </html>
    `;
  };

  // Create PDF
  const createPDF = async () => {
    const newHtml = generatePdf();
    const options = {
      html: newHtml,
      fileName: `sugresults_${rollNumber || 'result'}`,
      directory: 'Documents',
    };
    const file = await generatePDF(options);
    return file.filePath;
  };

  // Save PDF File to Downloads
  const saveFile = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Storage permission is required to save PDF.');
        return;
      }

      setLoadingMsg('Generating PDF & saving...');
      setLoading(true);

      const filePath = await createPDF();

      if (Platform.OS === 'android') {
        const timestamp = new Date().getTime().toString().slice(-4);
        const fileName = `sugresults_${rollNumber || 'result'}_${timestamp}.pdf`;
        await SaveResult.saveFileToDownloads(filePath, fileName);
        Alert.alert(
          'Download Complete! 🎉',
          `Provisional result saved to Downloads/sugresults/${fileName}\n\nYou can view and share it anytime from the Downloads tab.`
        );
      } else {
        Alert.alert('Saved', 'PDF generated successfully.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save PDF: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />

        {/* Top Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Provisional Grade Sheet</Text>
            {rollNumber && (
              <View style={styles.rollBadge}>
                <Ionicons name="person-outline" size={11} color="#4338CA" style={{ marginRight: 3 }} />
                <Text style={styles.rollBadgeText}>Roll: {rollNumber}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.downloadIconBtn}
            onPress={saveFile}
            disabled={loading}
          >
            <Ionicons name="download-outline" size={22} color="#4338CA" />
          </TouchableOpacity>
        </View>

        {/* WebView displaying result */}
        <WebView
          originWhitelist={['*']}
          source={{
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
                  ${mobileCSS}
                </head>
                <body>
                  <div class="result-box">
                    ${newData || '<p>No Result Data Found.</p>'}
                  </div>
                </body>
              </html>
            `,
          }}
          javaScriptEnabled
          domStorageEnabled
          style={styles.webView}
        />

        {/* Bottom Actions Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            disabled={loading}
            style={styles.secondaryActionBtn}
            onPress={() => router.push('/(tabs)')}
          >
            <Ionicons name="search-outline" size={18} color="#4338CA" style={{ marginRight: 6 }} />
            <Text style={styles.secondaryActionText}>Search Another</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={loading}
            style={[styles.primaryActionBtn, loading && styles.buttonDisabled]}
            onPress={saveFile}
          >
            <Ionicons name="cloud-download-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.primaryActionText}>Save PDF</Text>
          </TouchableOpacity>
        </View>

        {loading && <LoadingIndicator message={loadingMsg} />}
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  rollBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  rollBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338CA',
  },
  downloadIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  webView: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4338CA',
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4338CA',
    paddingVertical: 13,
    borderRadius: 12,
    shadowColor: '#4338CA',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  primaryActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  buttonDisabled: {
    backgroundColor: '#94A3B8',
    elevation: 0,
    shadowOpacity: 0,
  },
});

export default ResultView;

