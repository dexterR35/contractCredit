

import ReactLoading from 'react-loading';
import { FcLock, FcApproval } from "react-icons/fc";

const Example = ({ type, color }) => (
    <ReactLoading type={type} color={color} height={30} width={30} />
);

const ModalPopup = ({ visible, setLoading, emailUser, pdfUser }) => {
    return (
        visible && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-100 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-2xl max-w-72 sm:max-w-[20rem]">
                    {!setLoading ? (
                        <>
                            <div className="flex flex-col items-center justify-center">
                                <FcApproval size={50} className="mb-4" />
                                <p className="mb-4 text-center leading-5">O copie a contractului a fost trimis catre adresa dumneavoastra de email {emailUser}</p>
                                <p className="mb-8 text-center leading-5">Pentru a descarca manual contractul puteti <a href={pdfUser} target="_blank" className='cursor-pointer underline underline-offset-4'>apasa aici</a>.</p>
                                <a href="https://www.obtinecredit.ro" target="_self" className="flex justify-center w-full h-full pointer bg-green-600 max-w-56 rounded-md"><button>Afla mai multe</button></a>
                            </div>
                        </>
                    ) : (
                        <>
                            <FcLock size={50} className="mx-auto mb-2" />
                            <h2 className="text-2xl font-bold text-center mb-4">Va rugam asteptati</h2>
                            <p className="text-center mb-6">Se genereaza contractul...</p>
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
