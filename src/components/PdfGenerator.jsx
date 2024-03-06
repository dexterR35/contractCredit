import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { contractSections } from './TextObject'; 
import { Font, Image as PDFImage } from '@react-pdf/renderer';
import CustomFont from '../fonts/Roboto-Regular.ttf';
import { useFormData } from '../context/FormDataContext';

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
    signatureImage: {
        // Define styles for signature image if needed
    }
});

const MyDocument = ({ formData }) => {
  if (!formData) return null;

  const { firstName, lastName, signatureUrl } = formData;

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
                  <Text style={styles.text}>Client Name: {firstName} {lastName}</Text>
                  {/* Render signature image if available */}
                  {signatureUrl && <Image src={signatureUrl} style={styles.signatureImage} />}
              </View>
          </Page>
      </Document>
  );
};

export default MyDocument;