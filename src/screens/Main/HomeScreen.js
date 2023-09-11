import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  NativeModules,
  FlatList,
} from 'react-native';
import {useSelector} from 'react-redux';

const {PDFPickerModule} = NativeModules;

import {routes, goBack} from '../../utils/navigator';
import {ScrollView} from 'react-native-gesture-handler';
import VNIText from './VNIText';

const HomeScreen = ({componentId}) => {
  const isAuthenticated = useSelector(state => state.auth.isLoggedIn);
  const isLoading = useSelector(state => state.auth.isLoading);

  const [extractedText, setExtractedText] = useState([]);
  const [numLines, setNumLines] = useState(0);

  const loadPdf = async () => {
    try {
      const pdfURL = await PDFPickerModule.openPDFPicker();
      console.log('Selected PDF URL:', pdfURL);

      const textArray = await PDFPickerModule.extractTextFromPDF(pdfURL);
      console.log('AFTER CONVERT:', textArray);
      setExtractedText(textArray);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // Update the number of lines whenever extractedText changes
    setNumLines(extractedText.length);
  }, [extractedText]);

  // Render each item in the FlatList
  const renderItem = ({item}) => (
    <View style={styles.pageContainer}>
      <VNIText selectable style={styles.pageText} text={item.text} />
      {/* <Text  >
        {item.text}
      </Text> */}
    </View>
  );

  return (
    <View style={styles.homeContainer}>
      <FlatList
        ListHeaderComponent={<Button title="Get PDF" onPress={loadPdf} />}
        data={extractedText}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
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
      color: 'black',
    },
  },
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  pageContainer: {
    marginVertical: 10,
    backgroundColor: 'black',
    borderRadius: 3,
    // elevation: 2,
    padding: 10,
    borderColor: 'white',
    // borderWidth: 1,
  },
  pageText: {
    fontSize: 25,
  },
});

export default HomeScreen;
