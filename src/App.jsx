import React from 'react';
const ContractForm = React.lazy(() => import('./components/contractForm/ContractForm'));
import { ThreeDots } from 'react-loader-spinner';
function App() {
  return (
    <>
      <React.Suspense fallback={<div className='w-full h-screen flex justify-center items-center flex-col '><ThreeDots
        visible={true}
        height="80"
        width="80"
        color="#4fa94d"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
        <span>Loading...</span></div>}>
        <div className="bg-gray-100">
          <ContractForm />
        </div>
      </React.Suspense>
    </>
  );
}

export default App;
