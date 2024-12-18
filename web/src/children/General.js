import React, { useState } from 'react'
import { useEffect } from 'react';
import { connect } from 'react-redux'
import Dropdown from '../components/Dropdown';

export const General = (props) => {
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
        props.a_fetchLocations();
    }, [])

    useEffect(() => {
        if (props.common.locationList && props.common.locationList.length > 0) {
            let countries = props.common.locationList.map((item, index) => {
                return {
                    id: index,
                    label: item.country_code + '-' + item.country,
                    value: item.country_code
                }
            })
            setCountryList(countries)
        }
    }, [props.common.locationList])

    const handleCountryChange = (countryVal) => {
        if (!countryVal)
            setCountryLabel('Pick a country')
        else {
            let timezones = props.common.locationList.find(item => item.country_code === countryVal.value).timezones.map((item, index) => {
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
        <div className='flex flex-col col-span-3 p-2'>
            <h1 className='text-4xl font-montserrat tracking-wider font-bold text-purple-500'>General Settings</h1>
            <div className='flex flex-col gap-2 py-4 px-6'>
                {/* <div className=''>
                    <h2 className='text-2xl font-montserrat font-semibold text-gray-800 dark:text-gray-300'>Location</h2>
                    <h6 className='text-lg font-montserrat text-gray-500 dark:text-gray-400'>To manage the language settings and send out the digest right on time!</h6>
                    <div className='flex space-x-4 py-2 px-4'>
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
                <div className=''>
                    <h2 className='text-2xl font-montserrat font-semibold dark:text-gray-300'>Language</h2>
                    <h6 className='text-lg font-montserrat text-gray-500 dark:text-gray-400'>Pick your preferred language to view the website.</h6>
                    <div className='flex py-2 px-4'>
                        <ul id='tabSlider' className="flex space-x-2 items-center">
                            {langList.map((lang, index) => {
                                return <li key={index} onClick={() => setActiveLang(index)} className={index === activeLang ? "font-montserrat text-sm font-bold tracking-wider text-gray-700 bg-violet-300 rounded-lg h-fit shadow" : "font-montserrat text-sm font-bold tracking-wider text-gray-700 dark:text-gray-400 bg-slate-200 dark:bg-neutral-900 flex items-center shadow cursor-pointer rounded-lg h-fit"}>
                                    <div className="flex items-center">
                                        <span className="py-2 px-3 capitalize">{lang.label}</span>
                                    </div>
                                </li>
                            })}
                        </ul>
                    </div>
                </div>
                <div className=''>
                    <h2 className='text-2xl font-montserrat font-semibold dark:text-gray-300'>Two Factor Authentication</h2>
                    <div className='font-montserrat text-rose-400 font-semibold text-sm tracking-wider'>*Soon to come</div>
                    {/* <button className="bg-gradient-to-r font-montserrat font-semibold from-indigo-600 to-purple-400 mx-4 hover:scale-105 drop-shadow-md shadow-cla-blue px-4 py-1 rounded-lg">Setup</button> */}
                </div>
            </div>
        </div >
    )
}

export default General