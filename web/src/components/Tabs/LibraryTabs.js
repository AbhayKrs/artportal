import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Dropdown from '../Dropdown';

import { filterOptions, periodOptions } from '../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { a_fetchArtworks } from '../../store/actions/artworks.actions';

import { ReactComponent as EventsIcon } from '../../assets/icons/events.svg';

const LibraryTabs = ({ eventsPane, setEventsPane }) => {
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const [triggerEffect, setTriggerEffect] = useState(false);
    const [activeFilter, setActiveFilter] = useState('');
    const [activeFilterLabel, setActiveFilterLabel] = useState('Select a filter');
    const [activePeriod, setActivePeriod] = useState('');
    const [activePeriodLabel, setActivePeriodLabel] = useState('Select a time period');

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    useEffect(() => {
        const activePath = "library";

        if (triggerEffect) {
            //case 1 - No Filter / No Period
            if (activeFilter.length === 0 && activePeriod.length === 0) {
                navigate(`/${activePath}?filter=trending`);
                dispatch(a_fetchArtworks({ filter: "trending" }));
            }

            //case 5 - Filter / No Period
            if (activeFilter.length > 0 && activePeriod.length === 0) {
                navigate(`/${activePath}?filter=${activeFilter.replace(/\s+/g, '+')}`);
                dispatch(a_fetchArtworks({ filter: activeFilter.replace(/\s+/g, '+') }));
            }

            //case 6 - Filter / Period
            if (activeFilter.length > 0 && activePeriod.length > 0) {
                navigate(`/${activePath}?filter=${activeFilter.replace(/\s+/g, '+')}&period=${activePeriod.replace(/\s+/g, '+')}`);
                dispatch(a_fetchArtworks({ filter: activeFilter.replace(/\s+/g, '+'), period: activePeriod.replace(/\s+/g, '+') }))
            }

        }
    }, [triggerEffect, activeFilter, activePeriod]);

    useEffect(() => {
        if (params.filter || params.period) {
            params.filter ? setActiveFilter(params.filter) : setActiveFilter('');
            let filterlabel = params.filter && filterOptions.some(item => item.value === params.filter) ?
                filterOptions.find(item => item.value === params.filter).label
                :
                'Select a filter'
            setActiveFilterLabel(filterlabel);
            if (params.filter === 'trending' || params.filter === 'new' || params.filter === 'rising') {
                setActivePeriod('');
            } else {
                params.period ? setActivePeriod(params.period) : setActivePeriod('month')
            }

            let periodlabel = params.period && periodOptions.some(item => item.value === params.period) ?
                periodOptions.find(item => item.value === params.period).label
                :
                'Select a time period'
            setActivePeriodLabel(periodlabel);
        }
        setTriggerEffect(true);
    }, []);

    const selectFilter = (item) => {
        if (activeFilter === item.value) {
            setActiveFilter('');
            setActiveFilterLabel('Select a filter');
            setActivePeriod('');
            setActivePeriodLabel('Select a time period');
        } else {
            if (item.value === 'trending' || item.value === 'new' || item.value === 'rising') {
                setActivePeriod('');
                setActivePeriodLabel('Select a time period');
            } else {
                setActivePeriod('month');
                setActivePeriodLabel('Past Month');
            }
            setActiveFilter(item.value);
            setActiveFilterLabel(item.label);
        }
    }

    const handlePeriodChange = (item) => {
        setActivePeriod(item.value);
        setActivePeriodLabel(item.label);
    }

    return (
        <div className={`flex flex-col gap-2 w-full bg-slate-100/75 dark:bg-darkBg/75`}>
            <div className='flex flex-row gap-6 w-full'>
                <div className='flex items-center'>
                    <Dropdown
                        left
                        name='filters'
                        selected={activeFilterLabel}
                        options={filterOptions}
                        onSelect={selectFilter}
                    />
                    {activePeriod.length > 0 &&
                        <>
                            {window.innerWidth > 640 ?
                                <Dropdown
                                    left
                                    name='period'
                                    selected={activePeriodLabel}
                                    options={periodOptions}
                                    onSelect={handlePeriodChange}
                                />
                                :
                                <Dropdown
                                    right
                                    name='period'
                                    selected={activePeriodLabel}
                                    options={periodOptions}
                                    onSelect={handlePeriodChange}
                                />
                            }
                        </>
                    }
                </div>
                {!eventsPane && <button className='ml-auto' onClick={() => setEventsPane(!eventsPane)}>
                    <EventsIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />
                </button>}
            </div>
        </div>
    )
}

export default LibraryTabs;