import React, {useState, useEffect} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import PdfThumbnail from 'react-native-pdf-thumbnail';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import {
  Text,
  View,
  Button,
  Dialog,
  PanningProvider,
  Colors,
  ColorPalette,
} from 'react-native-ui-lib';
import DocumentPicker from 'react-native-document-picker';
import {Navigation} from 'react-native-navigation';
import {SelectableText} from 'react-native-custom-select-text';
import {useTranslation} from 'react-i18next';
import Clipboard from '@react-native-community/clipboard';
import pdfTextExtract from '../../nativeModules/pdfTextExtract';
import {routes} from '../../utils/navigator';
import {actions} from '../../redux/slices/home.slice';

import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const HomeScreen = ({componentId}) => {
  const isAuthenticated = useSelector(state => state.auth.isLoggedIn);
  const isLoading = useSelector(state => state.auth.isLoading);
  const books = useSelector(state => state.home.books);
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const [extractedText, setExtractedText] = useState([]);
  const [textSize, setTextSize] = useState(20);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [theme, setTheme] = useState(Colors.dark);
  const [textColor, setTextColor] = useState(Colors.white);
  const [bgColor, setBgColor] = useState(Colors.black);
  const [highlights, setHighlights] = useState([]);
  const [selectedBookName, setSelectedBookName] = useState('');
  const lastContentOffset = useSharedValue(0);
  const isScrolling = useSharedValue(false);

  useEffect(() => {
    // first

    Navigation.mergeOptions(componentId, {
      topBar: {
        // visible: false,
        drawBehind: true,

        hideOnScroll: true,
        leftButtons: [
          {
            id: 'mlKit',
            text: 'VNI/TCVN3',
            color: 'white',
          },
          {
            id: 'pdfKit',
            text: 'Unicode',
            color: 'white',
          },
        ],
        rightButtons: [
          {
            id: 'downFont',
            text: 'aA',
            color: 'white',
          },
        ],
      },
    });

    // Subscribe
    const navigationButtonEventListener =
      Navigation.events().registerNavigationButtonPressedListener(
        ({buttonId}) => {
          switch (buttonId) {
            case 'mlKit':
              pickDocument();
              break;
            case 'pdfKit':
              extractTextPDFkit();
              break;
            case 'downFont':
              setVisibleDialog(true);
              break;
          }
        },
      );

    return () => {
      // second
      navigationButtonEventListener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentId]);

  useEffect(() => {
    switch (theme) {
      case Colors.dark:
        setBgColor(Colors.black);
        setTextColor(Colors.white);
        break;
      case Colors.white:
        setBgColor(Colors.white);
        setTextColor(Colors.black);
        break;
      case Colors.yellow60:
        setBgColor(Colors.yellow80);
        setTextColor(Colors.grey1);
        break;
      default:
        break;
    }
  }, [theme]);

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
      setHighlights([]);
      if (books.filter(book => book.name === result.name).length > 0) {
        console.log('Book existed');
        setSelectedBookName(result.name);
        setExtractedText(
          books.filter(book => book.name === result.name)[0].book,
        );
        return;
      }

      setExtractedText([]);
      console.log('Selected PDF URL:', result.uri);

      // const textArray = await PDFPickerModule.extractTextFromPDF(pdfURL);
      // console.log('AFTER CONVERT:', textArray);
      // setExtractedText(textArray);
      const data2 = await PdfThumbnail.generateAllPages(result.uri, 100);
      setSelectedBookName(result.name);
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
          if (i === data2.length) {
            console.log('FINISH & ADD BOOK');
            dispatch(
              actions.addBook({
                id: books.length + 1,
                book: newArray,
                name: result.name,
              }),
            );
          }
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

  const extractTextPDFkit = async () => {
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
      setHighlights([]);
      if (books.filter(book => book.name === result.name).length > 0) {
        console.log('Book existed');
        setSelectedBookName(result.name);
        setExtractedText(
          books.filter(book => book.name === result.name)[0].book,
        );
        return;
      }

      setExtractedText([]);
      console.log('Selected PDF URL:', result.uri);

      const textArray = await pdfTextExtract.extractTextFromPDF(result.uri);

      dispatch(
        actions.addBook({
          id: books.length + 1,
          book: textArray,
          name: result.name,
        }),
      );
      setSelectedBookName(result.name);
      setExtractedText(textArray);
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
        setTextSize(textSize + 1);
        break;
      case 'down':
        setTextSize(textSize - 1);
        break;
      default:
        break;
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      if (lastContentOffset.value > event.contentOffset.y) {
        if (isScrolling.value) {
          Navigation.mergeOptions(componentId, {
            topBar: {
              visible: true,
            },
          });
        }
      } else if (lastContentOffset.value < event.contentOffset.y) {
        if (isScrolling.value) {
          // console.log('DOWN');
        }
      }
      lastContentOffset.value = event.contentOffset.y;
    },
    onBeginDrag: e => {
      isScrolling.value = true;
    },
    onEndDrag: e => {
      isScrolling.value = false;
    },
  });

  // Render each item in the FlatList
  const renderItem = ({item, index}) => (
    <View style={styles.pageContainer}>
      <SelectableText
        menuItems={[t('Copy'), t('Highlight')]}
        style={[styles.pageText, {fontSize: textSize, color: textColor}]}
        onSelection={({eventType, content, selectionStart, selectionEnd}) => {
          switch (eventType) {
            case t('Copy'):
              Clipboard.setString(content);
              break;
            case t('Highlight'):
              setHighlights(old => [
                ...old,
                {
                  id: content,
                  start: selectionStart,
                  end: selectionEnd,
                  pageIndex: index,
                },
              ]);
              dispatch(
                actions.addHighlight({
                  id: content,
                  start: selectionStart,
                  end: selectionEnd,
                  pageIndex: index,
                  bookName: selectedBookName, //mockup book id must be change to current book
                }),
              );
              break;
            default:
              break;
          }
        }}
        highlights={highlights.filter(row => row.pageIndex === index)}
        onHighlightPress={id => {
          console.log('id : ', id);
          // alert(id);
          // call your function
        }}
        highlightColor={Colors.red20}
        value={item.text}
      />
    </View>
  );

  return (
    <View style={[styles.homeContainer, {backgroundColor: bgColor}]}>
      <AnimatedFlatList
        onScroll={scrollHandler}
        data={extractedText}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <Dialog
        useSafeArea
        visible={visibleDialog}
        bottom
        style={styles.dialogStyle}
        onDismiss={() => setVisibleDialog(false)}
        panDirection={PanningProvider.Directions.DOWN}>
        <View padding-20 backgroundColor="white" style={styles.dialogStyle}>
          <View row centerV spread>
            <Text text80M>{t('ChooseTheme')}</Text>
            <ColorPalette
              colors={[Colors.dark, Colors.white, Colors.yellow60]}
              value={theme}
              onValueChange={value => setTheme(value)}
            />
          </View>
          <View row spread centerV marginB-20>
            <Text text80M>
              {t('FontSize')} {textSize}
            </Text>
            <View row>
              <Button
                round
                outline
                color={Colors.cyan10}
                size={Button.sizes.small}
                onPress={() => changeFontSize('down')}>
                <MaterialCommunityIcons
                  name="format-font-size-decrease"
                  size={20}
                  color={Colors.$iconPrimary}
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
          {/* <Dash length={300} thickness gap={1} /> */}
        </View>
      </Dialog>
    </View>
  );
};

HomeScreen.screenName = routes.Home;
HomeScreen.options = {
  topBar: {
    // visible: false,
    hideOnScroll: true,
    // title: {
    //   text: 'Buddha Book',
    //   color: 'white',
    // },
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
    // backgroundColor: 'black',
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
  dialogStyle: {
    borderRadius: 8,
  },
});

export default HomeScreen;
