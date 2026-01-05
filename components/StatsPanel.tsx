import { RiTimerLine } from "react-icons/ri";

export default function StatsPanel() {
    return (
        <div className="w-full max-w-5xl rounded-full py-3 px-5 bg-[#1B1B1F] flex items-center justify-between">
            <h1 className="text-[15px] font-semibold capitalize">Typing master</h1>
            <div>
                <button type="button" className="flex items-center gap-1 cursor-pointer">
                    <RiTimerLine size={18} />
                    <p className="text-sm">20s</p>
                </button>
                {/* <p className="text-sm flex">
                    <RiTimerLine size={15} />
                    20s
                </p> */}
            </div>
        </div>
    )
}