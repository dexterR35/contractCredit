import React from "react";

import ReactLoading from 'react-loading';
 
const Example = ({ type, color }) => (
    <ReactLoading type={type} color={color} height={50} width={50} />
);
const ModalPopup = ({ visible, setLoading }) => {
    return (
        visible && (
            <div className="fixed top-0 left-0 w-full h-full bg-green-900 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg">
                    {!setLoading ? (
                        <>
                            <div className="flex flex-col items-center justify-center max-w-72 sm:max-w-[25rem]">
                                <h2 className="text-2xl font-bold mb-4 text-center leading-">Datele au fost trimise cu succes</h2>
                                <p className="my-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, aliquid.</p>
                                <p className="mb-2">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo harum itaque repudiandae molestiae a.</p>
                                <p className="self-start mb-6">Daca fisierul nu s-a salvat automat. <a className="underline  text-blue-900 text-md pointer"> Click aici!! </a></p>
                                <a href="https://www.obtinecredit.ro" target="_self" className="flex justify-center w-full h-full pointer"><button>Afla mai multe</button></a>
                            </div>
                        </>
                    ) : (
                        <>
                        <h2 className="text-2xl font-bold">Datele se trimit...</h2>
                        <p className="text-center mb-6">Va rugam asteptati</p>
                        <div className="flex justify-center items-center w-full">
                        <Example type="spokes" color="#0bb51e" />
                        </div>
                     
                      </>
                    )}
                </div>
            </div>
        )
    );
};

export default ModalPopup;
