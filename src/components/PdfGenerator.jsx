// PDFGenerator.js
import React from "react";
import { Document, Page,  View, StyleSheet } from '@react-pdf/renderer';
import TextCredit from "./TextCredit";
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
});

const PdfGenerator = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
      <TextCredit />
      </View>
    </Page>
  </Document>
);

export default PdfGenerator;
