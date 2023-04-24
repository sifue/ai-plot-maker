import Link from 'next/link'
import React, { Fragment, useState, useEffect, SyntheticEvent } from 'react'
import { useRouter } from "next/router";
import { ThreeDots } from 'react-loader-spinner'

import { PlotParameter, PARAMETERS } from '../components/parameters'

type OutputState = {
    isPlotGenerated: boolean,
    label: string,
    plot: string,
}

function transformIdToName(idParameters: any) {
    idParameters.novelist = getNameFromId(PARAMETERS.novelist, idParameters.novelist);
    idParameters.genre = getNameFromId(PARAMETERS.genre, idParameters.genre);
    idParameters.when = getNameFromId(PARAMETERS.when, idParameters.when);
    idParameters.where = getNameFromId(PARAMETERS.where, idParameters.where);
    idParameters.who = getNameFromId(PARAMETERS.who, idParameters.who);
    idParameters.what = getNameFromId(PARAMETERS.what, idParameters.what);
    idParameters.how = getNameFromId(PARAMETERS.how, idParameters.how);
    idParameters.why = getNameFromId(PARAMETERS.why, idParameters.why);
}

function getNameFromId(parameter: PlotParameter[], id: string) {
    return parameter.find((p) => p.id === parseInt(id))?.name
}

export default function Output() {
    const [state, setState] = useState<OutputState>({ isPlotGenerated: false, label: '作成中です、数十秒お待ちください', plot: '' } as OutputState);
    const router = useRouter();
    const nps = { ...router.query };
    transformIdToName(nps);

    useEffect(() => {
        if (typeof window === "undefined") return; // サーバーサイドレンダリング時には実行しない
        if (!router.query) return; // パラメータがない場合は実行しない

        const fetchData = async () => {
            try {
                const queryParam = router.asPath.split('?')[1];
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/html; charset=utf-8' }
                };

                const response = await fetch('/api/plot.stream?'+ queryParam, requestOptions);
                const reader = response.body?.getReader();
                if (response.status !== 200 || !reader) {
                    throw new Error('Error fetching data : ' + response.status + ' ' + response.statusText);
                }

                const decoder = new TextDecoder('utf-8');
                // readAndSetStatus という再帰関数を定義
                const readAndSetStatus = async (): Promise<any> => {
                    const { done, value } = await reader.read();
                    if (done) return reader.releaseLock(); // readerが空になったら終了
                    const chunk = decoder.decode(value, { stream: true });
                    setState( prev => ({ isPlotGenerated: true, label: 'AIによる生成プロット', plot: prev.plot + chunk }));
                    return readAndSetStatus();
                };
                await readAndSetStatus();
            } catch (error) {
                console.error('Error fetching data:', error);
                setState({ isPlotGenerated: true, label: 'AIによる生成プロット', plot: 'エラーが発生しました。再読み込みを行って再度実行してください。' });
            }
        };
        fetchData();
    }, [router.query]);

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

                <div className="mx-auto w-full max-w-3xl gap-x-8 px-8">

                    <p className="text-base font-semibold leading-7 text-indigo-600"><Link href="/">戻る</Link></p>
                    <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">{state.label}</h1>

                    <div className="mx-auto max-w-4xl mt-6 border-t border-gray-100">
                        <dl className="divide-y divide-gray-100">
                            <div className="px-20 py-3 sm:grid sm:grid-cols-3 sm:gap-0 sm:px-0">
                                <dt className="text-sm font-medium leading-4 text-gray-900">作風の元となる小説家</dt>
                                <dd className="mt-1 text-sm leading-4 text-gray-700 sm:col-span-1 sm:mt-0">{nps.novelist}</dd>
                            </div>
                            <div className="px-20 py-3 sm:grid sm:grid-cols-3 sm:gap-0 sm:px-0">
                                <dt className="text-sm font-medium leading-4 text-gray-900">ジャンル</dt>
                                <dd className="mt-1 text-sm leading-4 text-gray-700 sm:col-span-2 sm:mt-0">{nps.genre}</dd>
                            </div>
                            <div className="px-20 py-3 sm:grid sm:grid-cols-3 sm:gap-0 sm:px-0">
                                <dt className="text-sm font-medium leading-4 text-gray-900">いつ</dt>
                                <dd className="mt-1 text-sm leading-4 text-gray-700 sm:col-span-2 sm:mt-0">{nps.when}</dd>
                            </div>
                            <div className="px-20 py-3 sm:grid sm:grid-cols-3 sm:gap-0 sm:px-0">
                                <dt className="text-sm font-medium leading-4 text-gray-900">どこ</dt>
                                <dd className="mt-1 text-sm leading-4 text-gray-700 sm:col-span-2 sm:mt-0">{nps.where}</dd>
                            </div>
                            <div className="px-20 py-3 sm:grid sm:grid-cols-3 sm:gap-0 sm:px-0">
                                <dt className="text-sm font-medium leading-4 text-gray-900">誰が</dt>
                                <dd className="mt-1 text-sm leading-4 text-gray-700 sm:col-span-2 sm:mt-0">{nps.who}</dd>
                            </div>
                            <div className="px-20 py-3 sm:grid sm:grid-cols-3 sm:gap-0 sm:px-0">
                                <dt className="text-sm font-medium leading-4 text-gray-900">何を</dt>
                                <dd className="mt-1 text-sm leading-4 text-gray-700 sm:col-span-2 sm:mt-0">{nps.what}</dd>
                            </div>
                            <div className="px-20 py-3 sm:grid sm:grid-cols-3 sm:gap-0 sm:px-0">
                                <dt className="text-sm font-medium leading-4 text-gray-900">どのように</dt>
                                <dd className="mt-1 text-sm leading-4 text-gray-700 sm:col-span-2 sm:mt-0">{nps.how}</dd>
                            </div>
                            <div className="px-20 py-3 sm:grid sm:grid-cols-3 sm:gap-0 sm:px-0">
                                <dt className="text-sm font-medium leading-4 text-gray-900">なぜ</dt>
                                <dd className="mt-1 text-sm leading-4 text-gray-700 sm:col-span-2 sm:mt-0">{nps.why}</dd>
                            </div>
                        </dl>
                    </div>

                    {!state.isPlotGenerated ? (<div className='w-full h-full flex h-40 py-10 items-center justify-center'><ThreeDots
                        height="80"
                        width="80"
                        radius="9"
                        color="#4f46e5"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        visible={true}
                    /></div>) : (<></>)}

                    <p className="mt-6 text-xl leading-10 text-gray-700 py-4 whitespace-break-spaces">
                        {state.plot}
                    </p>
                    <p className="text-base font-semibold leading-7 text-indigo-600"><Link href="/">戻る</Link></p>
                </div>
                <div className="text-center">
                    <p className="mt-6 text-lg px-0 leading-8 text-gray-600">
                    Created by <a className="font-medium text-indigo-600 dark:text-blue-500 hover:underline" href="https://github.com/sifue">@sifue</a>
                    </p>
                </div>
            </div>
        </div>
    )
}