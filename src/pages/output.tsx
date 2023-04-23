import Link from 'next/link'
import { Fragment, useState, SyntheticEvent } from 'react'
import { useRouter } from "next/router";
import { ThreeDots } from 'react-loader-spinner'

type OutputState = {
    isPlotGenerated: boolean,
    label: string,
    plot: string,
}


export default function Output() {

    const [state, setState] = useState({ isPlotGenerated: false, label: '作成中...', plot: '' } as OutputState);

    const router = useRouter();

    async function generatePlot() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(router.query)
          };
        await fetch('/api/plot.generate', requestOptions)

    }

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
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16">

                <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-x-8 px-8">

                    <p className="text-base font-semibold leading-7 text-indigo-600"><Link href="/">戻る</Link></p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{state.label}</h1>
                    { !state.isPlotGenerated ? (<ThreeDots
                        height="80"
                        width="80"
                        radius="9"
                        color="#4f46e5"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        visible={true}
                    />) : (<></>)}
                    
                    <p className="mt-6 text-xl leading-8 text-gray-700">
                        Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At arcu, sit dui mi, nibh dui, diam
                        eget aliquam. Quisque id at vitae feugiat egestas.
                    </p>
                    <p>
                        Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet
                        vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus viverra tellus varius sit neque
                        erat velit. Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris
                        semper sed amet vitae sed turpis id.
                    </p>
                </div>
            </div>
        </div>
    )
}