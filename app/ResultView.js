import { WebView } from 'react-native-webview';
import { Text, TouchableOpacity, StyleSheet,View ,Platform,PermissionsAndroid,Alert} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import * as Print from 'expo-print'; // Import the Print module
// import { shareAsync } from 'expo-sharing';
import RNFS from 'react-native-fs'; // Import the file system module

const ResultView = () => {
  const { result } = useLocalSearchParams(); // Get query parameters

  // CSS for responsive design
  const mobileCSS = `
    <style type="text/css">
      body { font-family: Arial, sans-serif; margin-top: 10%; }
      p { text-align: center; }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      table td, table th {
        padding: 8px;
        text-align: center;
      }
      table th { background-color: #f2f2f2; }
      @media only screen and (max-width: 600px) {
        .style1 { font-size: 1.8em; }
        .style2 { font-size: medium; }
        table, th, td { font-size: 0.9em; }
        p { font-size: small; }
      }
    </style>
  `;

  // Clean and transform data
  let newData = result?.replace('<a href=index.php>Search Another Number</a>', '');
  newData = newData?.replace(
    `<p align="center"><img src="Icon.JPG" width="100" height="100" /><img src="sug.png" width="72" height="79" align="right" /></p>`,
    `<div style="display: flex; justify-content: center;">
       <img height="150px" src="https://dli6r6oycdqaz.cloudfront.net/college-36/user-109260/30c39e6db4a149f89b6fd7f01e0cdde9_20210608_132206_36_109260_SUG_logo.png" />
     </div>`
  );

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to save the HTML file',
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
    return true; // iOS doesn't need this permission
  };
  const saveFile = async () => {
    const newHtml = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      
      <style>
     

        @page {
          size: A4;
    margin:2cm;
        }

        html, body {
          width: 210mm;
          height: 297mm;
          margin: 0 auto;
          padding: 1cm;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
          font-size: 12pt;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          word-wrap: break-word;
        }

        table, th, td {
          border: 1px solid #000;
        }

        th, td {
          padding: 6px;
          text-align: center;
        }

        img {
          max-width: 100%;
          height: auto;
        }
      </style>
    </head>
    <body  style="margin-top: 0;"} >${newData}</body>
  </html>
`;
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Storage permission is required.');
      return;
    }

    const { uri } = await Print.printToFileAsync({ html: newHtml });
 
   // Define destination path
   const destPath = `${RNFS.DownloadDirectoryPath}/result_${Date.now()}.pdf`;
  
    try {
     // Copy the generated PDF to Downloads folder
     await RNFS.copyFile(uri, destPath);
      Alert.alert('Success', `Saved to ${destPath}`);
    } catch (err) {
   
      Alert.alert('Error', 'Failed to save file');
    }
  };  

  // const HandlePrint = async () => {




  //   const printHtml = `
  //     <html>
  //       <head>
  //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //         ${mobileCSS}
  //       </head>
  //       <body>${newData || 'No Data Available'}</body>
  //     </html>
  //   `;

  //   try {
  //     const { uri } = await Print.printToFileAsync({ html: printHtml }); // Print to file
  //     console.log("Printed file URI:", uri); // For debugging purposes
  //     await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  //   } catch (error) {
  //     console.log("Print failed:", error); // Handle errors
  //   }
  // };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        {/* WebView for displaying HTML content */}
        <WebView
          originWhitelist={['*']}
          source={{
            html: `
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  ${mobileCSS}
                </head>
                <body>${newData || 'No Data Available'}</body>
              </html>
            `,
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          style={{ flex: 1 }}
        />
       <View style={styles.buttonBox}>
       <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
          <Text style={styles.buttonText}>Search Another Number</Text>
        </TouchableOpacity>

        {/* Print Button */}
        <TouchableOpacity style={styles.button} onPress={saveFile}>
          <Text style={styles.buttonText}>Download</Text>
        </TouchableOpacity>
       </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  button: {
    marginVertical: 5,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  buttonBox:{
    flexDirection:'row',
    justifyContent:'space-around'
  }
});

export default ResultView;
