import generatePDFBlob from "../GeneratePdf"


export const downloadPDF = async (values) => {
    try {
        const blob = await generatePDFBlob(values);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${values.firstName}_contract.pdf`; // Adjust the file name as needed
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error generating PDF:', error);
        // Handle error if PDF generation fails
    }
};