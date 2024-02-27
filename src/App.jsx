import { useState } from "react";
import MyForm from "./components/ContractForm";
import DisplayData from "./components/DisplayData";
import "./App.css";

function App() {
  return (
    <>
      <MyForm />
      <DisplayData />
    </>
  );
}

export default App;
