import React from 'react'

function SessionCards() {
    return (
        <div>
            {/* cards */}
            <div className="cards mb-16">
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {/* Total Applicants Card */}
                    <div class="flex flex-col gap-1.5 p-4 rounded-lg overflow-hidden items-start relative before:absolute before:left-1/2 before:-translate-x-1/2 before:bottom-1 before:h-[2px] before:w-9 before:bg-blue-500/50 dark:before:bg-blue-400 before:hidden bg-blue-50 dark:bg-blue-600/80 hover:shadow-lg transition-all duration-300">
                        <span class="h-[95px] w-[95px] rounded-full absolute -top-8 -right-8 ring-[20px] bg-blue-200/80 ring-blue-100/50 dark:bg-blue-400/30 dark:ring-blue-500/20"></span>
                        <div class="w-8 h-8 grid place-content-center rounded-full border border-dashed border-blue-500 dark:border-blue-300">
                            <span class="h-6 w-6 rounded-full grid place-content-center bg-blue-500 dark:bg-blue-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                </svg>
                            </span>
                        </div>
                        <span class="mt-3 text-sm text-gray-600 dark:text-blue-100 font-medium capitalize relative z-10">Total Applicants</span>
                        <div class="flex items-center gap-1">
                            <span class="text-lg font-semibold text-gray-800 dark:text-white">1,248</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-blue-500 dark:text-blue-300">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
                            </svg>
                        </div>
                    </div>

                    {/* Confirmed Applicants Card */}
                    <div class="flex flex-col gap-1.5 p-4 rounded-lg overflow-hidden items-start relative before:absolute before:left-1/2 before:-translate-x-1/2 before:bottom-1 before:h-[2px] before:w-9 before:bg-green-500/50 dark:before:bg-green-400 before:hidden bg-green-50 dark:bg-green-600/80 hover:shadow-lg transition-all duration-300">
                        <span class="h-[95px] w-[95px] rounded-full absolute -top-8 -right-8 ring-[20px] bg-green-200/80 ring-green-100/50 dark:bg-green-400/30 dark:ring-green-500/20"></span>
                        <div class="w-8 h-8 grid place-content-center rounded-full border border-dashed border-green-500 dark:border-green-300">
                            <span class="h-6 w-6 rounded-full grid place-content-center bg-green-500 dark:bg-green-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                        </div>
                        <span class="mt-3 text-sm text-gray-600 dark:text-green-100 font-medium capitalize relative z-10">Confirmed</span>
                        <div class="flex items-center gap-1">
                            <span class="text-lg font-semibold text-gray-800 dark:text-white">842</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-green-500 dark:text-green-300">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
                            </svg>
                        </div>
                    </div>

                    {/* Pending Applicants Card */}
                    <div class="flex flex-col gap-1.5 p-4 rounded-lg overflow-hidden items-start relative before:absolute before:left-1/2 before:-translate-x-1/2 before:bottom-1 before:h-[2px] before:w-9 before:bg-yellow-500/50 dark:before:bg-yellow-400 before:hidden bg-yellow-50 dark:bg-yellow-600/80 hover:shadow-lg transition-all duration-300">
                        <span class="h-[95px] w-[95px] rounded-full absolute -top-8 -right-8 ring-[20px] bg-yellow-200/80 ring-yellow-100/50 dark:bg-yellow-400/30 dark:ring-yellow-500/20"></span>
                        <div class="w-8 h-8 grid place-content-center rounded-full border border-dashed border-yellow-500 dark:border-yellow-300">
                            <span class="h-6 w-6 rounded-full grid place-content-center bg-yellow-500 dark:bg-yellow-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                        </div>
                        <span class="mt-3 text-sm text-gray-600 dark:text-yellow-100 font-medium capitalize relative z-10">Pending</span>
                        <div class="flex items-center gap-1">
                            <span class="text-lg font-semibold text-gray-800 dark:text-white">312</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-yellow-500 dark:text-yellow-300">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
                            </svg>
                        </div>
                    </div>

                    {/* Rejected Applicants Card */}
                    <div class="flex flex-col gap-1.5 p-4 rounded-lg overflow-hidden items-start relative before:absolute before:left-1/2 before:-translate-x-1/2 before:bottom-1 before:h-[2px] before:w-9 before:bg-red-500/50 dark:before:bg-red-400 before:hidden bg-red-50 dark:bg-red-600/80 hover:shadow-lg transition-all duration-300">
                        <span class="h-[95px] w-[95px] rounded-full absolute -top-8 -right-8 ring-[20px] bg-red-200/80 ring-red-100/50 dark:bg-red-400/30 dark:ring-red-500/20"></span>
                        <div class="w-8 h-8 grid place-content-center rounded-full border border-dashed border-red-500 dark:border-red-300">
                            <span class="h-6 w-6 rounded-full grid place-content-center bg-red-500 dark:bg-red-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </span>
                        </div>
                        <span class="mt-3 text-sm text-gray-600 dark:text-red-100 font-medium capitalize relative z-10">Rejected</span>
                        <div class="flex items-center gap-1">
                            <span class="text-lg font-semibold text-gray-800 dark:text-white">94</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-red-500 dark:text-red-300">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SessionCards