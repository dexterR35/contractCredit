import React from "react";

const ModalPopup = ({ visible, setLoading }) => {
  return (
    visible && (
      <div className="fixed top-0 left-0 w-full h-full bg-gray-900 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg">
          {setLoading ? (
            <>
              <p>Data is added successfully!</p>
              <button onClick={() => {}}>Button 1</button>
              <button onClick={() => {}}>Button 2</button>
            </>
          ) : (
            <p>Data is sending, please wait...</p>
          )}
        </div>
      </div>
    )
  );
};

export default ModalPopup;
