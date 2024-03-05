import MyForm from "./components/ContractForm";
import DisplayData from "./components/DisplayData";
import PdfGenerator from "./components/PdfGenerator";
function App() {
  
  return (
    <>
    <div className="bg-green-200">
      <MyForm className="bg-white"/>
      {/* <DisplayData /> */}

      <PdfGenerator  />
      </div>
    </>
  );
}

export default App;
