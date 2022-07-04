import React, { useState, useEffect, useRef } from 'react';
import { fetchExploreImages } from '../api';

import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export const ExploreShowCarousel = (props) => {
  return (
    <div className="flex relative lg:col-span-8 w-full justify-center bg-gray-300 dark:bg-[#101010]">
      <div className="flex flex-col my-3 mx-4 md:mx-32 space-y-3 w-full justify-center">
        <div className='flex w-fit self-center items-center place-content-center'>
          <div className='flex fixed top-14 right-0 lg:right-[33.5%]  m-5 space-x-3 p-1 bg-neutral-100 dark:bg-neutral-800 rounded'>
            {props.prevTrue ? <div onClick={props.prev} className='cursor-pointer flex justify-end py-0.5 space-x-2 text-gray-700 hover:text-violet-400 dark:text-gray-200 dark:hover:text-violet-500'>
              <FaChevronLeft className='h-6 w-6' />
            </div> : ''}
            {props.nextTrue ? <div onClick={props.next} className='cursor-pointer flex justify-end py-0.5 space-x-2 text-gray-700 hover:text-violet-400 dark:text-gray-200 dark:hover:text-violet-500'>
              <FaChevronRight className='h-6 w-6' />
            </div> : ''}
          </div>
          <img src={`${fetchExploreImages(props.currentImage)}`} className="h-full px-10 xs:px-0 object-cover object-center rounded-lg" />
        </div>
        <div className='flex w-fit flex-col self-center items-center space-y-3 place-content-center'>
          {props.secondaryImages.map((image, index) => (
            <img key={index} src={`${fetchExploreImages(image)}`} className="h-full px-10 xs:px-0 object-cover object-center rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}

export const HomeMultiCarousel = (props) => {
  return (
    <div className="w-full relative flex items-center justify-center">
      <GoChevronLeft onClick={props.prev} className='h-8 w-8 text-neutral-600' />
      <div className="w-full h-full overflow-x-hidden overflow-y-hidden">
        <div id="slider" className="h-full flex space-x-2 items-center justify-start transition ease-out duration-700">
          {props.data.map((item, index) => {
            return <div key={index} className="flex h-56 w-56 flex-shrink-0 relative">
              <img src={item.image} alt="black chair and white table" className="object-cover object-center w-full rounded-lg" />
              <div className="bg-gray-800 bg-gradient-to-t from-black rounded-lg bg-opacity-30 absolute w-full h-full p-2">
                <div className="flex flex-col h-full justify-end">
                  <h3 className="text-xl lg:text-2xl font-josefinlight font-semibold leading-5 lg:leading-6 text-white dark:text-neutral-200">{item.title}</h3>
                  <span className='text-md font-josefinlight text-white dark:text-neutral-400 truncate'>{item.title2}</span>
                </div>
              </div>
            </div>
          })}
        </div>
      </div>
      <GoChevronRight onClick={props.next} className='h-8 w-8 text-neutral-600' />
    </div>
  )
}

export const HomeSingleCarousel = (props) => {
  let count = 0;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    startSlider();
  }, []);

  useEffect(() => {
    setFade(true);
    setTimeout(() => {
      setFade(false)
    }, 3500)
  }, [currentIndex])

  const startSlider = () => {
    setInterval(() => {
      handleNextClick();
    }, 4000)
  }

  const handleNextClick = () => {
    count = (count + 1) % bannerCarousel.length;
    setCurrentIndex(count);
  }

  const bannerCarousel = [
    { id: 1, img: 'https://cdnb.artstation.com/p/assets/images/images/046/930/067/large/anato-finnstark-eledegian.jpg?1646323393', title: 'The Lost Giant', artist: 'Anato Finnstark' },
    { id: 1, img: 'https://cdnb.artstation.com/p/assets/images/images/046/649/377/large/anato-finnstark-web-petit.jpg?1645623908', title: 'Fire Dragon God', artist: 'Anato Finnstark' },
    { id: 1, img: 'https://cdna.artstation.com/p/assets/images/images/040/230/710/large/anato-finnstark-web-petit.jpg?1628237453', title: 'The Wolf Princess', artist: 'Anato Finnstark' }
  ]
  return (
    <div className="relative h-full">
      <div className="relative w-full h-full overflow-hidden">
        <div className="active float-left w-full h-full">
          <img
            src={bannerCarousel[currentIndex].img}
            className={`block w-full h-full transition-opacity duration-700 ease-in  ${fade ? 'opacity-100' : 'opacity-0'}`}
            alt="Wild Landscape"
          />
          <div className='absolute h-full w-full bottom-0 bg-gradient-to-t from-black/70 to-black/10'>
            <div className='h-fit w-full pb-2 pl-2 absolute bottom-0'>
              <h1 className='text-3xl font-black font-josefinlight text-gray-200 text-end'>{bannerCarousel[currentIndex].title}</h1>
              <h2 className='text-xl font-josefinregular text-gray-400 text-end'>{bannerCarousel[currentIndex].artist}</h2>
              <div className='flex flex-row absolute space-x-1 bottom-2 right-20'>
                {bannerCarousel.map((img, index) => (
                  <label className="flex items-center cursor-pointer text-xl">
                    <input type="radio" name="radio" className="hidden peer" checked={currentIndex === index} />
                    <span className="w-3 h-3 inline-block rounded-full border border-blue-400 flex-no-shrink peer-checked:bg-blue-400"></span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div >
  )
}

export const StoreMultiCarousel = (props) => {
  const maxScrollWidth = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carousel = useRef(null);

  useEffect(() => {
    if (carousel !== null && carousel.current !== null) {
      carousel.current.scrollLeft = carousel.current.offsetWidth * currentIndex;
    }
  }, [currentIndex]);

  useEffect(() => {
    maxScrollWidth.current = carousel.current ? carousel.current.scrollWidth - carousel.current.offsetWidth : 0;
  }, []);

  const movePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevState => prevState - 1);
    }
  }

  const moveNext = () => {
    if (carousel.current !== null && carousel.current.offsetWidth * currentIndex <= maxScrollWidth.current) {
      setCurrentIndex(prevState => prevState + 1);
    }
    else if (carousel.current.offsetWidth * currentIndex > maxScrollWidth.current) {
      setCurrentIndex(0)
    }
  }

  return (
    <div className="relative overflow-hidden">
      <div className="flex justify-between absolute top left w-full h-full">
        <button
          onClick={() => movePrev()}
          className="hover:bg-violet-900/75 rounded-r-md text-white dark:text-gray-800 w-10 h-full text-center opacity-75 hover:opacity-100 disabled:opacity-25 disabled:cursor-not-allowed z-10 p-0 m-0 transition-all ease-in-out duration-300"
        >
          <GoChevronLeft className='h-12 w-20 -ml-5 text-neutral-800 dark:text-gray-300' />
        </button>
        <button
          onClick={() => moveNext()}
          className="hover:bg-violet-900/75 rounded-l-md text-white dark:text-gray-800 w-10 h-full text-center opacity-75 hover:opacity-100 disabled:opacity-25 disabled:cursor-not-allowed z-10 p-0 m-0 transition-all ease-in-out duration-300"
        >
          <GoChevronRight className='h-12 w-20 -ml-5 text-neutral-800 dark:text-gray-300' />
        </button>
      </div>
      <div ref={carousel} className="carousel-container relative flex gap-3 overflow-hidden scroll-smooth snap-x snap-mandatory touch-pan-x z-0 mx-14">
        {props.data.map((item, index) => {
          return (
            <div key={index} className="carousel-item rounded text-center relative w-56 h-56 snap-start">
              <div className='h-full w-full aspect-square block bg-origin-padding bg-left-top bg-cover bg-no-repeat z-0'>
                <img src={item.image} alt={item.title} className="w-full aspect-square rounded" />
                <div className="h-full w-full aspect-square block absolute top-0 left-0 transition-opacity duration-300 opacity-0 hover:opacity-75 bg-violet-500/75 z-10 rounded">
                  <h3 className="absolute font-caviar font-semibold bottom-0 text-white py-6 px-3 mx-auto text-xl">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}