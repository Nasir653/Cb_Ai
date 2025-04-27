import * as Popover from "@radix-ui/react-popover";

export default function PopperExample() {
    return (
        <Popover.Root>
            <div className="flex space-x-2">

                {/* Copy Button */}
                <button className="copy-button cursor-pointer flex items-center justify-center h-6 rounded-full border border-color-common w-6 can-hover:hover:bg-black/5 dark:can-hover:hover:bg-white/5 min-h-8 min-w-[34px] hover:bg-[#ebebeb]" onClick={() => navigator.clipboard.writeText("Copied Text")}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlSpace="preserve"
                        width="15"
                        height="15"
                        viewBox="0 0 682.667 682.667"
                    >
                        <path
                            fill="#808080"
                            d="M565 640H225c-41.36 0-75-33.64-75-75V225c0-41.36 33.64-75 75-75h340c41.36 0 75 33.64 75 75v340c0 41.36-33.64 75-75 75M225 200c-13.785 0-25 11.215-25 25v340c0 13.785 11.215 25 25 25h340c13.785 0 25-11.215 25-25V225c0-13.785-11.215-25-25-25zM100 440H75c-13.785 0-25-11.215-25-25V75c0-13.785 11.215-25 25-25h340c13.785 0 25 11.215 25 25v23.75h50V75c0-41.36-33.64-75-75-75H75C33.64 0 0 33.64 0 75v340c0 41.36 33.64 75 75 75h25zm0 0"
                            data-original="#242424"
                        ></path>
                    </svg>
                </button>

                {/* Create Topic Button */}
                <Popover.Trigger className="create-database-topic cursor-pointer flex items-center justify-center h-6 rounded-full border border-color-common w-6 can-hover:hover:bg-black/5 dark:can-hover:hover:bg-white/5 min-h-8 min-w-[34px] hover:bg-[#ebebeb]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" className="h-[15px] w-[15px]" viewBox="0 0 24 24">
                        <path fill="#808080" fillRule="evenodd" d="M12 3a1 1 0 0 1 1 1v7h7a1 1 0 1 1 0 2h-7v7a1 1 0 1 1-2 0v-7H4a1 1 0 1 1 0-2h7V4a1 1 0 0 1 1-1" clipRule="evenodd"></path>
                    </svg>
                </Popover.Trigger>


            </div>

            <Popover.Portal>
                <Popover.Content
                    className="bg-white shadow-lg border border-gray-200 p-4 rounded-lg w-48 text-sm text-gray-700 animate-fade-in"
                    side="bottom"
                    align="center"
                    collisionPadding={10}
                >
                    <div className="bg-white">
                        <div className="pb-3 border-b border-[#ebebeb]">
                            <div className="flex items-center mb-2">
                                <span className="text-sm font-semibold text-gray-700">Add to Dashboard</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Create Dashboard"
                                className="w-full p-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-[#ebebeb]"
                            />
                        </div>
                        <div className="mt-3">
                            <ul className="text-gray-700 max-h-25 overflow-y-auto">
                                <li className="px-2 py-2 hover:bg-[#f4f3ee] cursor-pointer font-normal rounded-lg">
                                    <a href="#" className="text-sm leading-none font-normal text-gray-700 flex">
                                        Project Alpha
                                    </a>
                                </li>
                                <li className="px-2 py-2 hover:bg-[#f4f3ee] cursor-pointer font-normal rounded-lg">
                                    <a href="#" className="text-sm leading-none font-normal text-gray-700 flex">
                                        Project Beta
                                    </a>
                                </li>
                                <li className="px-2 py-2 hover:bg-[#f4f3ee] cursor-pointer font-normal rounded-lg">
                                    <a href="#" className="text-sm leading-none font-normal text-gray-700 flex">
                                        Project Gamma
                                    </a>
                                </li>
                                <li className="px-2 py-2 hover:bg-[#f4f3ee] cursor-pointer font-normal rounded-lg">
                                    <a href="#" className="text-sm leading-none font-normal text-gray-700 flex">
                                        Project Delta
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Popover.Arrow className="fill-gray-200" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}