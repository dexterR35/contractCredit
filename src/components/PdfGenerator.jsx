import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { contractSections } from './TextObject'; 
import { Font } from '@react-pdf/renderer';
import CustomFont from '../fonts/Roboto-Regular.ttf';


Font.register({
    family: 'Roboto',
    src: CustomFont, 
  });

  
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 12,
    marginBottom: 5,
  },
});


const MyDocument = () => {
  if (!contractSections) return null;
  // Flatten all sections into a single array of elements
  const contentElements = contractSections.flatMap(section => [
    <Text key={section.title} style={styles.title}>{section.title}</Text>,
    ...section.items.map((item, index) => (
      <Text key={index} style={styles.text}>{item}</Text>
    )),
  ]);
  
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
        <Text style={styles.text}>Contract de Prestari Servicii</Text>
          {contentElements}
        </View>
      </Page>
    </Document>
  );
};

// Define PDFGenerator component
const PDFGenerator = () => {
  return (
    <div>
      <PDFDownloadLink document={<MyDocument />} fileName="contract.pdf">
        {({ loading }) =>
          loading ? 'Loading document...' : 'Download now!'
        }
      </PDFDownloadLink>
    </div>
  );
};

// Export PDFGenerator component
export default PDFGenerator;
