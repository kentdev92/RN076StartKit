import React, {useState} from 'react';
import {Text, StyleSheet, FlatList} from 'react-native';
import {useSelector} from 'react-redux';

import {routes} from '../../utils/navigator';
import PdfThumbnail from 'react-native-pdf-thumbnail';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import {View, Button} from 'react-native-ui-lib';
import DocumentPicker from 'react-native-document-picker';

const HomeScreen = () => {
  const isAuthenticated = useSelector(state => state.auth.isLoggedIn);
  const isLoading = useSelector(state => state.auth.isLoading);

  const [extractedText, setExtractedText] = useState([]);
  const [textSize, setTextSize] = useState(20);

  // Function to pick a PDF document
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf], // Specify the file type you want to pick (PDF in this case)
      });

      console.log(
        result.uri, // URI of the picked file
        result.type, // MIME type of the picked file
        result.name, // Name of the picked file
        result.size, // Size of the picked file (in bytes)
      );
      if (typeof result.uri !== 'string') {
        return;
      }
      console.log('Selected PDF URL:', result.uri);

      // const textArray = await PDFPickerModule.extractTextFromPDF(pdfURL);
      // console.log('AFTER CONVERT:', textArray);
      // setExtractedText(textArray);
      const data2 = await PdfThumbnail.generateAllPages(result.uri, 100);
      console.log(data2);
      if (data2 && data2.length > 0) {
        let newArray = [...extractedText];
        for (let i = 0; i < data2.length; i++) {
          const element = data2[i];
          const result = await TextRecognition.recognize(element.uri);
          console.log('Recognized text:', result.text);
          // Append a new item to the copy
          newArray.push({text: result.text, page: i});

          // Update the state with the new array
          setExtractedText(newArray);
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User canceled the picker
      } else {
        throw err;
      }
    }
  };
  const changeFontSize = type => {
    switch (type) {
      case 'up':
        setTextSize(textSize + 2);
        break;
      case 'down':
        setTextSize(textSize - 2);
        break;

      default:
        break;
    }
  };

  // Render each item in the FlatList
  const renderItem = ({item}) => (
    <View style={styles.pageContainer}>
      <Text selectable style={[styles.pageText, {fontSize: textSize}]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.homeContainer}>
      <FlatList
        ListHeaderComponent={
          <View row spread centerV>
            <Button
              size={Button.sizes.small}
              label={'Choose'}
              onPress={pickDocument}
            />
            <View row>
              <Button
                round
                size={Button.sizes.small}
                onPress={() => changeFontSize('down')}>
                <MaterialCommunityIcons
                  name="format-font-size-decrease"
                  size={20}
                  color={'white'}
                />
              </Button>

              <View marginL-10>
                <Button
                  round
                  size={Button.sizes.small}
                  onPress={() => changeFontSize('up')}>
                  <MaterialCommunityIcons
                    name="format-font-size-increase"
                    size={20}
                    color={'white'}
                  />
                </Button>
              </View>
            </View>
          </View>
        }
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
    visible: false,
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
    borderTopColor: 'white',
    borderTopWidth: 1,
  },
  pageText: {
    color: 'white',
  },
});

export default HomeScreen;
