import Link from 'next/link'
import React, { Fragment, useState, useEffect, SyntheticEvent } from 'react'
import { useRouter } from "next/router";
import { ThreeDots } from 'react-loader-spinner'

type OutputState = {
    isPlotGenerated: boolean,
    label: string,
    plot: string,
}

type ApiResponse = {
    parmeters: {
        selectedNovelist: string,
        selectedGenre: string,
        selectedWhen: string,
        selectedWhere: string,
        selectedWho: string,
        selectedWhat: string,
        selectedHow: string,
        selectedWhy: string
      },
    plot: string
}

export default function Output() {

    const [state, setState] = useState<OutputState>({ isPlotGenerated: false, label: '作成中...', plot: '' } as OutputState);

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(router.query)
            };

            const response = await fetch('/api/plot.generate', requestOptions);
            const jsonResponse: ApiResponse = await response.json();
            console.log(jsonResponse);
            setState({ isPlotGenerated: true, label: 'AIによる生成プロット', plot: jsonResponse.plot });
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
      }, []);

    return (
        <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <svg
                    className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
                    aria-hidden="true"
                >
                    <defs>
                        <pattern
                            id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                            width={200}
                            height={200}
                            x="50%"
                            y={-1}
                            patternUnits="userSpaceOnUse"
                        >
                            <path d="M100 200V.5M.5 .5H200" fill="none" />
                        </pattern>
                    </defs>
                    <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
                        <path
                            d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                            strokeWidth={0}
                        />
                    </svg>
                    <rect width="100%" height="100%" strokeWidth={0} fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
                </svg>
            </div>
            <div className="mx-auto gap-x-8 gap-y-16">

                <div className="mx-auto w-full max-w-3xl  gap-x-8 px-8">

                    <p className="text-base font-semibold leading-7 text-indigo-600"><Link href="/">戻る</Link></p>
                    <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">{state.label}</h1>
                    { !state.isPlotGenerated ? (<div className='w-full h-full flex h-40 items-center justify-center'><ThreeDots
                        height="80"
                        width="80"
                        radius="9"
                        color="#4f46e5"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        visible={true}
                    /></div>) : (<></>)}
                    
                    <p className="mt-6 text-xl leading-10 text-gray-700 py-4">
                        {state.plot}
                    </p>
                    <p className="text-base font-semibold leading-7 text-indigo-600"><Link href="/">戻る</Link></p>
                </div>
            </div>
        </div>
    )
}