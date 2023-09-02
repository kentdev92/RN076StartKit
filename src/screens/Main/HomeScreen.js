import React, {useState} from 'react';
import {View, Text, StyleSheet, Button, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentPicker from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import PDFLib, {PDFDocument, rgb} from 'react-native-pdf-lib';
import * as FileSystem from 'react-native-fs';

import {routes, goBack} from '../../utils/navigator';

const HomeScreen = ({componentId}) => {
  //   const isAuthenticated = useSelector(state => !!state.auth.token);
  const isAuthenticated = useSelector(state => state.auth.isLoggedIn);
  const isLoading = useSelector(state => state.auth.isLoading);

  const [pdfUri, setPdfUri] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [extractedText, setExtractedText] = useState([]);

  const loadPdf = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      const pdfUri = result[0].uri;
      console.log(pdfUri);
      setPdfUri(pdfUri);
      extractTextFromPDF(pdfUri);
    } catch (error) {
      console.log('Document picker error:', error);
    }
  };

  const extractTextFromPDF = async pdfPath => {
    try {
      const pdf = await PDFDocument.load(pdfPath);
      const textArray = [];

      for (let i = 0; i < pdf.getPagesCount(); i++) {
        const page = pdf.getPage(i);
        const pageText = await page.extractText();
        textArray.push(pageText);
      }

      setExtractedText(textArray);
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
    }
  };
  const applyStyles = async () => {
    if (!pdfUri) return;

    try {
      const pdfDoc = await PDFDocument.modify(pdfUri);

      for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
        const page = pdfDoc.getPage(pageIndex);
        const texts = page.getTextContent().items;
        texts.forEach(text => {
          text.setFontColor(rgb(255, 255, 255));
        });
        page.setBackgroundColor(rgb(0, 0, 0));
      }

      const modifiedPdfPath = FileSystem.CachesDirectoryPath + '/modified.pdf';

      await pdfDoc.write(modifiedPdfPath);

      setPdfUri(modifiedPdfPath);
    } catch (error) {
      console.log('Error applying styles:', error);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.pageContainer}>
      <Text style={styles.pageText}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.homeContainer}>
      <Text>{isLoading}</Text>
      <Text>{isAuthenticated ? 'Da dang nhap' : 'Chua dang nhap'}</Text>
      <Button title="Pick PDF" onPress={loadPdf} />
      <Button
        title="goBack"
        onPress={() => {
          //test purpose
          goBack(componentId);
        }}
      />
      <Icon name="music" size={30} color="#900" />
      {pdfUri && (
        <>
          <View style={styles.container}>
            <FlatList
              data={extractedText}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </>
      )}
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
    justifyContent: 'center',
    alignItems: 'center',
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
    marginHorizontal: 20,
    marginBottom: 20,
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
