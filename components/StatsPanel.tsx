"use client";
import { useTyping } from "@/provider/TypingProvider";
import { useState } from "react";
import { FaKeyboard } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { MdClose, MdOutlineSettings } from "react-icons/md";

export default function StatsPanel({
    hideStats,
    setRerenderKey
}: {
    hideStats: boolean,
    setRerenderKey: React.Dispatch<React.SetStateAction<number>>
}) {

    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const { setInitialSetting, initialSetting } = useTyping();

    const [settings, setSettings] = useState(initialSetting);

    const updateSetting = (key: string, value: string | boolean | number) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
    };

    const openMenu = () => {
        setIsOpenMenu(true);
    };

    const onClose = () => {
        setIsOpenMenu(false);
    };

    // saveSettings
    const saveSettings = () => {
        setInitialSetting(settings);
        setIsOpenMenu(false);
        setRerenderKey((prev) => prev + 1);
    };

    return (
        <>
            <div className={`w-full h-16 border-b-2 fixed top-0 border-b-[#1B1B1F] flex items-center justify-between ${hideStats ? 'invisible' : 'visible'}`}>
                <div className="container mx-auto">
                    <div className="w-full flex items-center justify-between px-3">
                        <FaKeyboard className="text-orange-400" size={25} />
                        <button onClick={openMenu} type="button" className="cursor-pointer transition-all ease-in-out hover:bg-[#1B1B1F]  text-2xl w-10 h-10 rounded-full flex items-center justify-center">
                            <HiOutlineMenuAlt3 />
                        </button>
                    </div>
                </div>
            </div>

            {
                isOpenMenu && (
                    <div className="w-full h-full fixed top-0 left-0 bg-[#0c0c0e5b] backdrop-blur-xs z-40"></div>
                )
            }
            <div className={`w-full min-h-screen max-w-md bg-[#222227] fixed right-0 top-0 z-50 transition-transform duration-300 ease-in-out ${isOpenMenu ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between px-5 py-2 border-b border-[#1B1B1F]">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <MdOutlineSettings className="w-6 h-6 text-orange-500" />
                        Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-3 cursor-pointer hover:bg-[#1B1B1F] rounded-full transition-colors text-gray-400 hover:text-white">
                        <MdClose size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                            <FiClock size={14} /> Mode
                        </div>
                        <div className="flex bg-[#1a1a1e] p-1 rounded-full">
                            {['time', 'words'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => updateSetting('mode', mode)}
                                    className={`flex-1 cursor-pointer py-2 text-sm font-medium rounded-full capitalize transition-all ${settings.mode === mode
                                        ? 'bg-orange-400 text-black'
                                        : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                            {settings.mode === 'time' ? 'Duration (Seconds)' : 'Word Count'}
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {(settings.mode === 'time' ? [15, 30, 60, 120] : [10, 25, 50, 100]).map((val) => (
                                <button
                                    key={val}
                                    onClick={() => updateSetting(settings.mode === 'time' ? 'duration' : 'wordCount', val)}
                                    className={`py-2 px-3 rounded-full cursor-pointer text-sm font-bold transition-all border ${(settings.mode === 'time' ? settings.duration : settings.wordCount) === val
                                        ? 'border-orange-400 text-orange-400 bg-yellow-500/10'
                                        : 'border-transparent bg-[#2c2c33] text-gray-400 hover:bg-[#35353d]'
                                        }`}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t absolute w-full bottom-0 max-sm:bottom-10 border-[#1B1B1F] bg-[#1e1e22]">
                    <button
                        onClick={saveSettings}
                        className="w-full py-3 text-sm bg-orange-400 hover:bg-orange-500 text-black font-bold rounded-full transition-colors shadow-lg shadow-orange-500/20 cursor-pointer">
                        Start Test
                    </button>
                </div>
            </div>
        </>
    )
}