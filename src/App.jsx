import MyForm from "./components/contractForm/ContractForm";
import DisplayData from "./components/DisplayData";
import PdfGenerator from "./components/PdfGenerator";
import ContractForm from './components/contractForm/ContractForm'
import { FormDataProvider } from './context/FormDataContext'; 
function App() {
  
  return (
    <>
       <FormDataProvider>
    <div className="bg-green-200">
      {/* <MyForm className="bg-white"/> */}
      <ContractForm />
      <DisplayData />
      {/* <PdfGenerator  /> */}
      </div>
      </FormDataProvider>
    </>
  );
}

export default App;
