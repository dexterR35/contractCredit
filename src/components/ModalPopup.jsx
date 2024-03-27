

import { MagnifyingGlass } from 'react-loader-spinner';
import { FcAssistant, FcCheckmark } from "react-icons/fc";


const ModalPopup = ({ visible, setLoading, emailUser, pdfUser }) => {
    return (
        visible && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-100 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-2xl max-w-72 sm:max-w-[20rem]">
                    {!setLoading ? (
                        <>
                            <div className="flex flex-col items-center justify-center">
                                <FcCheckmark size={50} className="mb-4" />
                                <p className="mb-4 text-center leading-5">O copie a contractului a fost trimis către adresa dumneavoastră de email <span className='font-bold'>{emailUser}</span></p>
                                <p className="mb-8 text-center leading-5">Pentru a descărca manual contractul puteți <a href={pdfUser} target="_blank" className='cursor-pointer underline underline-offset-4 font-bold'>apasa aici</a>.</p>
                                <a href="https://www.obtinecredit.ro" target="_self" className="flex justify-center w-full h-full pointer bg-green-600 max-w-56 rounded-md"><button>Află mai multe</button></a>
                            </div>
                        </>
                    ) : (
                        <>
                            <FcAssistant size={50} className="mx-auto mb-2" />
                            <h2 className="text-2xl font-bold text-center mb-0">Vă rugăm așteptați</h2>
                            <p className="text-center mb-6">Se generează contractul...</p>
                            <div className="flex justify-center items-center w-full">

                                <MagnifyingGlass
                                    visible={true}
                                    height="50"
                                    width="50"
                                    ariaLabel="magnifying-glass-loading"
                                    wrapperStyle={{}}
                                    wrapperClass="magnifying-glass-wrapper"
                                    glassColor="#c0efff"
                                    color="#93c47d"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    );
};

export default ModalPopup;
