import { WebView } from 'react-native-webview';
import { Text, TouchableOpacity, StyleSheet, View, Platform, PermissionsAndroid, Alert, NativeModules } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import LoadingIndicator from '../src/components/ActivityIndicator';
import RNFS from 'react-native-fs';
const { SaveResult } = NativeModules;

const ResultView = () => {
  const { result } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  // 📱 Mobile Friendly CSS
  const mobileCSS = `
    <style type="text/css">
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
          Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        margin: 0;

        background-color: #f9fafb;
        color: #111827;
      }

      h1, h2, h3 {
        text-align: center;
        color: #1e3a8a;
        margin-bottom: 10px;
      }

      p {
        text-align: center;
        font-size: 14px;
        color: #374151;
      }

      .result-box {
        background: #fff;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        margin-bottom: 20px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
        border-radius: 8px;
        overflow: hidden;
      }

      table th {
        background-color: #2563eb;
        color: #fff;
        padding: 5px;
        font-size: 14px;
        text-transform: uppercase;
      }

      table td {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        padding: 5px;
        text-align: center;
        font-size: 13px;
      }

      table tr:nth-child(even) td {
        background-color: #f3f4f6;
      }

      img {
        display: block;
        margin: 0 auto 15px auto;
        max-width: 100px;
        height: auto;
      }

  
    </style>
  `;

  // 🧹 Clean and transform result HTML
  let newData = result?.replace('<a href=index.php>Search Another Number</a>', '');
  newData = newData?.replace(
    `<p align="center"><img src="Icon.JPG" width="100" height="100" /><img src="sug.png" width="72" height="79" align="right" /></p>`,
    `<div style="text-align:center;">
       <img src="https://dli6r6oycdqaz.cloudfront.net/college-36/user-109260/30c39e6db4a149f89b6fd7f01e0cdde9_20210608_132206_36_109260_SUG_logo.png" />
     </div>`
  );

  // 📂 Storage Permission
  const requestPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 30) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to save the result PDF',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS + Android 11+ don’t need it
  };

  // 📝 Generate HTML for PDF
  const generatePdf = () => {
    const newHtml = `
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
    return newHtml;
  };

  // 📄 Create PDF
  const createPDF = async () => {
    const newHtml = generatePdf();
    let options = {
      html: newHtml,
      fileName: 'sugresults',
      directory: 'Documents',
    };
    let file = await RNHTMLtoPDF.convert(options);
    return file.filePath;
  };

  // 💾 Save PDF File
  const saveFile = async () => {
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Storage permission is required.');
        return;
      }
      setLoading(true);

      const u = await createPDF();

      if (Platform.OS === 'android') {
        const fileName = `sugresults_${Date.now()}.pdf`;
        await SaveResult.saveFileToDownloads(u, fileName);
        Alert.alert('Download complete', `Saved to Downloads/sugresults/${fileName}`);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save file: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        {/* 🌐 WebView to show result */}
        <WebView
          originWhitelist={['*']}
          source={{
            html: `
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  ${mobileCSS}
                </head>
                <body>
                  <div class="result-box">
                    ${newData || 'No Data Available'}
                  </div>
                </body>
              </html>
            `,
          }}
          javaScriptEnabled
          domStorageEnabled
          style={{ flex: 1 }}
        />

        {/* 🔘 Bottom Buttons */}
        <View style={styles.buttonBox}>
          <TouchableOpacity
            disabled={loading}
            style={[styles.button, loading ? styles.buttonDisabled : styles.buttonEnabled]}
            onPress={() => router.push('/')}
          >
            <Text style={styles.buttonText}>Search Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={loading}
            style={[styles.button, loading ? styles.buttonDisabled : styles.buttonEnabled]}
            onPress={saveFile}
          >
            <Text style={styles.buttonText}>Download PDF</Text>
          </TouchableOpacity>
        </View>

        {loading && <LoadingIndicator />}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  button: {
    marginVertical: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    minWidth: '40%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonEnabled: {
    backgroundColor: '#2563eb',
  },
});

export default ResultView;
