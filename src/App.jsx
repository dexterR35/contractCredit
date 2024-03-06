
import DisplayData from "./components/DisplayData";

import ContractForm from './components/contractForm/ContractForm'
import { FormDataProvider } from './context/FormDataContext'; 

function App() {
  
  return (
    <>
       <FormDataProvider>
    <div className="bg-green-200">
   
      <ContractForm />
      {/* <DisplayData /> */}
  
   
      </div>
    
      </FormDataProvider>

      {/* <MyDocument /> */}
    </>
  );
}

export default App;
