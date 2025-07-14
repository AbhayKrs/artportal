import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { a_fetchLocations } from '../store/actions/common.actions';

export const General = (props) => {
    const dispatch = useDispatch();
    const common = useSelector(state => state.common);

    const [countryList, setCountryList] = useState([{
        id: -1,
        label: '',
        value: ''
    }])
    const [timezoneList, setTimezoneList] = useState([]);
    const [langList, setLangList] = useState([
        {
            id: 0,
            label: 'English',
            value: 'en'
        },
        // {
        //     id: 1,
        //     label: 'French',
        //     value: 'fr'
        // }
    ]);

    const [countryLabel, setCountryLabel] = useState('Pick a country');
    const [tzLabel, setTZLabel] = useState('Pick a timezone');
    const [activeLang, setActiveLang] = useState(0);

    useEffect(() => {
        dispatch(a_fetchLocations());
    }, [])

    useEffect(() => {
        if (common.locationList && common.locationList.length > 0) {
            let countries = common.locationList.map((item, index) => {
                return {
                    id: index,
                    label: item.country_code + '-' + item.country,
                    value: item.country_code
                }
            })
            setCountryList(countries)
        }
    }, [common.locationList])

    const handleCountryChange = (countryVal) => {
        if (!countryVal)
            setCountryLabel('Pick a country')
        else {
            let timezones = common.locationList.find(item => item.country_code === countryVal.value).timezones.map((item, index) => {
                return {
                    id: index,
                    label: item,
                    value: item
                }
            });
            setCountryLabel(countryVal.label)
            setTimezoneList(timezones)
        }
    }

    const handleTimezoneChange = (tzValue) => {
        if (!tzValue)
            setTZLabel('Pick a timezone')
        else
            setTZLabel(tzValue.value)
    }

    return (
        <div className='flex flex-col gap-4 col-span-3 p-2'>
            <h1 className="text-2xl font-medium tracking-wide text-neutral-700 dark:text-gray-300">General Settings</h1>
            <div className='flex flex-col gap-6'>
                {/* <div className=''>
                    <h2 className='text-2xl  font-semibold text-gray-800 dark:text-gray-300'>Location</h2>
                    <h6 className='text-lg  text-gray-500 dark:text-gray-400'>To manage the language settings and send out the digest right on time!</h6>
                    <div className='flex gap-4 py-2 px-4'>
                        <span className='flex flex-col gap-1 text-md text-gray-700 dark:text-gray-300'>
                            Country
                            <Dropdown left name='country' selectedPeriod={countryLabel} options={countryList} onSelect={handleCountryChange} />
                        </span>
                        {timezoneList.length > 0 && <span className='flex flex-col gap-1 text-md text-gray-700 dark:text-gray-300'>
                            Timezone
                            <Dropdown left name='timezone' selectedPeriod={tzLabel} options={timezoneList} onSelect={handleTimezoneChange} />
                        </span>}
                    </div>
                </div> */}
                <div className='flex flex-col gap-1'>
                    <h2 className='text-lg font-semibold text-neutral-700 dark:text-gray-300'>Language</h2>
                    <p className='text-lg text-neutral-700 dark:text-gray-300'>Pick your preferred language to view the website.</p>
                    <div className='flex'>
                        <ul id='tabSlider' className="flex gap-2 items-center">
                            {langList.map((lang, index) => {
                                return <li key={index} onClick={() => setActiveLang(index)} className={index === activeLang ? " text-sm font-bold tracking-wide text-neutral-800 dark:text-neutral-300 border-2 border-neutral-800 dark:border-neutral-300 rounded-lg h-fit shadow" : " text-sm font-bold tracking-wide text-gray-700 dark:text-gray-400 bg-slate-200 dark:bg-neutral-900 flex items-center shadow cursor-pointer rounded-lg h-fit"}>
                                    <div className="flex items-center">
                                        <span className="py-2 px-3 capitalize">{lang.label}</span>
                                    </div>
                                </li>
                            })}
                        </ul>
                    </div>
                </div>
                <div className='flex flex-col gap-1'>
                    <h2 className='text-lg font-semibold text-neutral-700 dark:text-gray-300'>Two Factor Authentication</h2>
                    <p className='italic text-neutral-700 dark:text-gray-300 font-semibold text-sm tracking-wide'>Soon to come</p>
                    {/* <button className="bg-gradient-to-r  font-semibold from-blue-700 to-purple-400 mx-4 hover:scale-105 drop-shadow-md shadow-cla-blue px-4 py-1 rounded-lg">Setup</button> */}
                </div>
            </div>
        </div >
    )
}

export default General