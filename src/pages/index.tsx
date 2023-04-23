import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'

import { PlotParameter, PARAMETERS } from '../components/parameters'

const inter = Inter({ subsets: ['latin'] })

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { Fragment, useState, SyntheticEvent } from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Listbox, Transition } from '@headlessui/react'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

function getRandomElement<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error('Array is empty');
  }

  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export default function Home() {
  const novelist = PARAMETERS.novelist;
  const [selectedNovelist, setSelectedNovelist] = useState(novelist[0]);

  const ganre = PARAMETERS.ganre;
  const [selectedGenre, setSelectedGanre] = useState(ganre[0]);

  const when = PARAMETERS.when;
  const [selectedWhen, setSelectedWhen] = useState(when[0]);

  const where = PARAMETERS.where;
  const [selectedWhere, setSelectedWhere] = useState(where[0]);

  const who = PARAMETERS.who;
  const [selectedWho, setSelectedWho] = useState(who[0]);

  const what = PARAMETERS.what;
  const [selectedWhat, setSelectedWhat] = useState(what[0]);

  const how = PARAMETERS.how;
  const [selectedHow, setSelectedHow] = useState(how[0]);

  const why = PARAMETERS.why;
  const [selectedWhy, setSelectedWhy] = useState(why[0]);

  const router = useRouter()
  function handleSubmit(e: SyntheticEvent) {
    const query = { selectedNovelist: selectedNovelist.id, selectedGenre: selectedGenre.id, selectedWhen: selectedWhen.id, selectedWhere: selectedWhere.id, selectedWho: selectedWho.id, selectedWhat: selectedWhat.id, selectedHow: selectedHow.id, selectedWhy: selectedWhy.id };
    e.preventDefault();
    console.log('You clicked submit.');
    router.push({ pathname: '/output', query: query });
  }

  function handleRandomize(e: SyntheticEvent) {
    setSelectedNovelist(getRandomElement(novelist));
    setSelectedGanre(getRandomElement(ganre));
    setSelectedWhen(getRandomElement(when));
    setSelectedWhere(getRandomElement(where));
    setSelectedWho(getRandomElement(who));
    setSelectedWhat(getRandomElement(what));
    setSelectedHow(getRandomElement(how));
    setSelectedWhy(getRandomElement(why));
    e.preventDefault();
    console.log('You clicked randomize.');
  }

  const listBoxProps = [
    { key: 'novelist', selected: selectedNovelist, setSelected: setSelectedNovelist, parameters: novelist, label: '作風の元となる小説家' },
    { key: 'ganre', selected: selectedGenre, setSelected: setSelectedGanre, parameters: ganre, label: 'ジャンル' },
    { key: 'when', selected: selectedWhen, setSelected: setSelectedWhen, parameters: when, label: 'いつ' },
    { key: 'where', selected: selectedWhere, setSelected: setSelectedWhere, parameters: where, label: 'どこ' },
    { key: 'who', selected: selectedWho, setSelected: setSelectedWho, parameters: who, label: '誰が' },
    { key: 'what', selected: selectedWhat, setSelected: setSelectedWhat, parameters: what, label: '何を' },
    { key: 'how', selected: selectedHow, setSelected: setSelectedHow, parameters: how, label: 'どのように' },
    { key: 'why', selected: selectedWhy, setSelected: setSelectedWhy, parameters: why, label: 'なぜ' }
  ];

  const listBoxList: JSX.Element[] = [];
  for (const p of listBoxProps) {
    listBoxList.push(
      (<div className="sm:col-span-2" key={p.key}>
        <Listbox value={p.selected} onChange={p.setSelected}>
          {({ open }) => (
            <>
              <Listbox.Label className="block text-sm font-semibold leading-6 text-gray-900">{p.label}</Listbox.Label>
              <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                  <span className="flex items-center">
                    <span className="ml-3 block truncate">{p.selected.name}</span>
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Transition
                  show={open}
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {p.parameters.map((item) => (
                      <Listbox.Option
                        key={item.id}
                        className={({ active }) =>
                          classNames(
                            active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-3 pr-9'
                          )
                        }
                        value={item}
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="flex items-center">
                              <span
                                className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                              >
                                {item.name}
                              </span>
                            </div>

                            {selected ? (
                              <span
                                className={classNames(
                                  active ? 'text-white' : 'text-indigo-600',
                                  'absolute inset-y-0 right-0 flex items-center pr-4'
                                )}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
      </div>));
  }

  return (
    <div className="isolate bg-white px-24 py-12 sm:py-12 lg:px-8">
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">AIプロットメーカー</h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          起承転結の物語のプロットをお手軽作成
        </p>
      </div>


      <form onSubmit={handleSubmit} action="#" method="POST" className="mx-auto mt-4 max-w-xl sm:mt-8">
        <div className="mx-auto mt-4 text-right">
          <button
            onClick={handleRandomize} className="rounded-md bg-violet-600 px-3.5 py-2.5 text-center text-xs font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            ランダム化
          </button>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">

          {listBoxList}

        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            プロット作成
          </button>
        </div>
      </form>
      <div className="text-center">
        <p className="mt-6 text-lg px-0 leading-8 text-gray-600">
          Created by <a className="font-medium text-indigo-600 dark:text-blue-500 hover:underline" href="https://github.com/sifue">@sifue</a>
        </p>
      </div>

    </div>

  )
}
