import React from 'react';
import { Document, Page, Text, View, StyleSheet} from '@react-pdf/renderer';
import { contractSections } from './TextObject'; 
import { Font } from '@react-pdf/renderer';
import CustomFont from '../fonts/Roboto-Regular.ttf';
import { useFormData } from '../context/FormDataContext';
Font.register({
    family: 'Roboto',
    src: CustomFont, // Adjust the path as necessary
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

// Define MyDocument component
const MyDocument = () => {
  // Check if contractSections is defined
  if (!contractSections) return null;
  
  // Flatten all sections into a single array of elements
  const contentElements = contractSections.flatMap(section => [
    <Text key={section.title} style={styles.title}>{section.title}</Text>,
    ...section.items.map((item, index) => (
      <Text key={index} style={styles.text}>{item}</Text>
    )),
  ]);
  const { formData } = useFormData();
  // Render Document with content
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>First Name: {formData.firstName}</Text>
          <Text style={styles.title}>Last Name: {formData.lastName}</Text>
          <Text style={styles.title}>Phone: {formData.phone}</Text>
          <Text style={styles.title}>Email: {formData.email}</Text>
          {contentElements}
          <img src={formData.signature}  />
          <img src={formData.photo}  />
          {/* Include other form fields as needed */}
        </View>
      </Page>
      <div>
 
    </div>
    </Document>
    
  );
}
  export default MyDocument;
