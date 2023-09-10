import React, {useState} from 'react';
import {View, Text, StyleSheet, Button, NativeModules} from 'react-native';
import {useSelector} from 'react-redux';

const {PDFPickerModule} = NativeModules;

import {routes, goBack} from '../../utils/navigator';
import {ScrollView} from 'react-native-gesture-handler';
import iconv from 'iconv-lite';
import {Buffer} from 'buffer';
import {VietnameseConversion} from 'vietnamese-conversion';

const HomeScreen = ({componentId}) => {
  //   const isAuthenticated = useSelector(state => !!state.auth.token);
  const isAuthenticated = useSelector(state => state.auth.isLoggedIn);
  const isLoading = useSelector(state => state.auth.isLoading);

  const [extractedText, setExtractedText] = useState([]);

  const loadPdf = async () => {
    // Open the PDF picker and get the selected PDF file's URL
    PDFPickerModule.openPDFPicker()
      .then(pdfURL => {
        console.log('Selected PDF URL:', pdfURL);

        // Now, extract text from the selected PDF
        PDFPickerModule.extractTextFromPDF(pdfURL)
          .then(text => {
            // console.log('Extracted text:', text);
            // Now you can use the extracted text in your React Native app.
            console.log(
              'AFTER CONVERT: ',
              text,
              new VietnameseConversion(text, 'vni').toCharset('unicode'),
              // iconv.decode(Buffer.from(text, 'binary'), 'tcvn3'),
            );
            setExtractedText(text);
          })
          .catch(error => {
            console.error('Error extracting text:', error);
          });
      })
      .catch(error => {
        console.error('Error opening PDF picker:', error);
      });
  };

  // Function to convert TCVN3 to Unicode
  const convertTCVN3ToUnicode = tcvn3Text => {
    console.log('1');
    try {
      // Convert TCVN3 text to Unicode (UTF-8)
      const tcvn3Buffer = new Uint8Array(tcvn3Text.length);
      console.log('2', tcvn3Buffer);
      for (let i = 0; i < tcvn3Text.length; i++) {
        tcvn3Buffer[i] = tcvn3Text.charCodeAt(i);
      }
      const unicodeText = iconv.decode(tcvn3Buffer, 'win1258');
      console.log('after decode: ', unicodeText);
      return unicodeText;
    } catch (error) {
      console.log('3');
      console.log('Error converting TCVN3 to Unicode:', error);
      return tcvn3Text; // Return the input text as-is on error
    }
  };

  return (
    <View style={styles.homeContainer}>
      <ScrollView style={styles.container}>
        <Button title="Pick PDF" onPress={loadPdf} />
        <Text>{extractedText}</Text>
      </ScrollView>
    </View>
  );
};

HomeScreen.screenName = routes.Home;
HomeScreen.options = {
  topBar: {
    title: {
      text: 'Home',
      color: 'white',
      textAlign: 'left',
    },
    background: {
      color: 'purple',
    },
  },
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'black',
  },
  pdf: {
    flex: 1,
    // height: '200px',
    width: '100%',
    // backgroundColor: 'red',
  },
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
    padding: 20,
  },
  pageContainer: {
    marginVertical: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    padding: 16,
  },
  pageText: {
    // fontFamily: 'CustomFont', // Use your custom font
    fontSize: 16,
  },
});

export default HomeScreen;
