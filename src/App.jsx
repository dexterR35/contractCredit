
import DisplayData from "./components/DisplayData";

import ContractForm from './components/contractForm/ContractForm'
import { FormDataProvider } from './context/FormDataContext'; 
import PdfGenerator from "./components/PdfGenerator";
function App() {
  
  return (
    <>
       <FormDataProvider>
    <div className="bg-green-200">
   
      <ContractForm />
      {/* <DisplayData /> */}
      <PdfGenerator  />
   
      </div>
    
      </FormDataProvider>

      {/* <MyDocument /> */}
    </>
  );
}

export default App;
