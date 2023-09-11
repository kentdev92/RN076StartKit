import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import jschardet from 'jschardet';
import iconv from 'iconv-lite';
import {Buffer} from 'buffer';

const CustomText = ({text}) => {
  const [wordEncodings, setWordEncodings] = useState([]);
  const [convertedWords, setConvertedWords] = useState([]);

  //   useEffect(() => {
  //     // Split the input text into words
  //     const words = text.split(/\s+/);

  //     // Detect the encoding for each word or use UTF-8 as a fallback
  //     const detectedEncodings = words.map(word => {
  //       const result = jschardet.detect(Buffer.from(word, 'binary'));
  //       //   console.log(result.encoding, word);
  //       return result.encoding || 'UTF-8'; // Use UTF-8 as a fallback
  //     });

  //     setWordEncodings(detectedEncodings);
  //   }, [text]);

  //   useEffect(() => {
  //     // Convert each word to UTF-8
  //     const converted = wordEncodings.map(
  //       (encoding, index) =>
  //         iconv
  //           .decode(iconv.encode(text.split(/\s+/)[index], 'latin1'), 'utf8')
  //           .toString('utf8'),
  //       //   iconv.decode(Buffer.from(text.split(/\s+/)[index], 'binary'), encoding),
  //     );

  //     setConvertedWords(converted);
  //   }, [wordEncodings, text]);

  const convertedText = convertedWords.join(' ');

  return (
    <Text
      selectable
      style={{
        fontSize: 20,
        color: 'white',
        //   fontFamily: 'VNI-Times'
      }}>
      {text}
    </Text>
  );
};

export default CustomText;
