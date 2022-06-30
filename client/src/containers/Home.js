import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HomeTabPanel } from '../components/TabPanel';
import { fetchExploreList } from '../store/actions/explore.actions';
import { setLoader, getTags } from '../store/actions/common.actions';
import { MultipleCarousel, HomeMultiCarousel } from '../components/Carousel';

const Home = (props) => {
    useEffect(() => {
        props.setLoader(true);
        window.scrollTo(0, 0);
        props.fetchExploreList();
        props.getTags();
    }, [])
    let defaultTransform = 0;

    const goNext = () => {
        defaultTransform = defaultTransform - 398;
        var slider = document.getElementById("slider");
        if (Math.abs(defaultTransform) >= slider.scrollWidth / 1.7)
            defaultTransform = 0;
        slider.style.transform = "translateX(" + defaultTransform + "px)";
    }
    const goPrev = () => {
        var slider = document.getElementById("slider");
        if (Math.abs(defaultTransform) === 0) defaultTransform = 0;
        else defaultTransform = defaultTransform + 398;
        slider.style.transform = "translateX(" + defaultTransform + "px)";
    }

    const carouselData = [{
        id: 1,
        image: 'https://images.unsplash.com/photo-1644416598043-11c2816eec28?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80',
        title: 'Library of Craft',
        title2: 'Scroll through the pages that define craft.'
    }, {
        id: 2,
        image: 'https://images.pexels.com/photos/161154/stained-glass-spiral-circle-pattern-161154.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
        title: 'Mirror Spiral',
        title2: 'Endless spiral of paint that each have a tale of its own.'
    }, {
        id: 3,
        image: 'https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        title: 'World of Lost Colors',
        title2: 'Mix of various techniques into the discovery of something unknown.'
    }, {
        id: 4,
        image: 'https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        title: 'The Brush that Defines Art',
        title2: 'Each brush tells the tale of the artist that held it for his mastery.'
    }, {
        id: 5,
        image: 'https://images.pexels.com/photos/20967/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        title: 'Witness the Majestic Frames',
        title2: 'A picture frame is a poem without words.'
    }, {
        id: 6,
        image: 'https://images.pexels.com/photos/587958/pexels-photo-587958.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        title: 'Blended Paint',
        title2: 'All have beauty to it, not everyone perceives it the way presented.'
    }]

    return (
        <div className='main-container bg-gray-200 dark:bg-darkNavBg'>
            <div className="flex pt-2 items-center justify-center w-full h-full">
                <HomeMultiCarousel
                    prev={() => goPrev()}
                    next={() => goNext()}
                    data={carouselData}
                />
            </div>
            <HomeTabPanel tags={props.common.tags} exploreList={props.explore.exploreList} />
        </div >
    )
}

const mapStateToProps = (state, props) => ({
    explore: state.explore,
    common: state.common,
    user: state.common.user
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setLoader,
    fetchExploreList,
    getTags
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
