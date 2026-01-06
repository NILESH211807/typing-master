import { IoMdClose } from "react-icons/io";
import { calculateResult, secondsToTime } from "@/helper/result";
import { ResultDataType } from "./TextDisplay";

type ResultModalProps = {
    resultData: ResultDataType;
    reset: (type?: string) => void;
}

export default function ResultModal({ resultData, reset }: ResultModalProps) {
    const data = calculateResult(resultData);

    console.log(data);


    const closeModal = () => {
        reset();
    }

    const handleRepeat = () => {
        reset("repeat");
    }

    return (
        <>
            <div className="w-full h-full fixed top-0 left-0 bg-[#0c0c0e5b] backdrop-blur-xs z-40"></div>
            <div className="w-[95%] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-55 max-w-2xl bg-[#26262c] rounded-md">
                <div className="w-full flex items-center justify-between px-5 py-3 relative border-b-2 border-b-[#1d1d22]">
                    <h1 className="text-xl font-bold">Result</h1>
                    <span onClick={closeModal} className="cursor-pointer absolute right-3 top-3 w-9 h-9 hover:bg-[#1d1d22] transition-all ease-in-out duration-300 rounded-full flex items-center justify-center">
                        <IoMdClose size={20} />
                    </span>
                </div>

                <div className="px-5 my-2">
                    <div className="grid grid-cols-3 gap-3 my-5">
                        <div className="w-full border border-[#1d1d22] bg-[#222227] rounded-md py-2 px-3 relative">
                            <p className="text-[11px] text-[#6f6f79] capitalize font-semibold">WPM (Words per minute)</p>
                            <h1 className="text-xl font-bold">{data.wpm}</h1>
                            <div className="mt-1 bg-linear-to-br from-indigo-600 to-orange-600 w-full h-0.75 rounded-full"></div>
                        </div>
                        <div className="w-full border border-[#1d1d22] bg-[#222227] rounded-md py-2 px-3 relative">
                            <p className="text-[11px] text-[#6f6f79] capitalize font-semibold">CPM (Characters per minute)</p>
                            <h1 className="text-xl font-bold">{data.cpm}</h1>
                            <div className="mt-1 bg-linear-to-br from-indigo-600 to-orange-600 w-full h-0.75 rounded-full"></div>
                        </div>
                        <div className="w-full border border-[#1d1d22] bg-[#222227] rounded-md py-2 px-3 relative">
                            <p className="text-[11px] text-[#6f6f79] capitalize font-semibold">KPM (Keystrokes per minute)</p>
                            <h1 className="text-xl font-bold">{data.kpm}</h1>
                            <div className="mt-1 bg-linear-to-br from-indigo-600 to-orange-600 w-full h-0.75 rounded-full"></div>
                        </div>
                        <div className="w-full border border-[#1d1d22] bg-[#222227] rounded-md py-2 px-3 relative">
                            <p className="text-[11px] text-[#6f6f79] capitalize font-semibold">Accuracy</p>
                            <h1 className="text-xl font-bold">{data.accuracy}%</h1>
                            <div className="mt-1 bg-linear-to-br from-indigo-600 to-orange-600 w-full h-0.75 rounded-full"></div>
                        </div>
                        <div className="w-full border border-[#1d1d22] bg-[#222227] rounded-md py-2 px-3 relative">
                            <p className="text-[11px] text-[#6f6f79] capitalize font-semibold">Time Taken</p>
                            <h1 className="text-xl font-bold">{secondsToTime(data.timeSeconds)}</h1>
                            <div className="mt-1 bg-linear-to-br from-indigo-600 to-orange-600 w-full h-0.75 rounded-full"></div>
                        </div>
                        <div className="w-full border border-[#1d1d22] bg-[#222227] rounded-md py-2 px-3 relative">
                            <p className="text-[11px] text-[#6f6f79] capitalize font-semibold">Currect Characters</p>
                            <h1 className="text-xl font-bold">{data.correctChars}</h1>
                            <div className="mt-1 bg-linear-to-br from-indigo-600 to-orange-600 w-full h-0.75 rounded-full"></div>
                        </div>
                        <div className="w-full border border-[#1d1d22] bg-[#222227] rounded-md py-2 px-3 relative">
                            <p className="text-[11px] text-[#6f6f79] capitalize font-semibold">Incorrect Characters</p>
                            <h1 className="text-xl font-bold">{data.incorrectChars}</h1>
                            <div className="mt-1 bg-linear-to-br from-indigo-600 to-orange-600 w-full h-0.75 rounded-full"></div>
                        </div>
                    </div>

                    <div className="w-full flex items-center justify-end my-5 gap-3">
                        <button className="px-5 py-2 bg-linear-to-br from-red-500 to-red-600 rounded-full text-white text-sm font-semibold cursor-pointer" onClick={handleRepeat}>Repeat</button>
                        <button className="px-5 py-2 bg-linear-to-br from-indigo-600 to-orange-600 rounded-full text-white text-sm font-semibold cursor-pointer" onClick={closeModal}>Next</button>
                    </div>
                </div>
            </div>
        </>
    )
}