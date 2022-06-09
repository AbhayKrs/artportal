import React, { useState, useEffect, useRef } from 'react';
import { fetchExploreImages, fetchUserImages } from '../api';

import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export const ExploreShowCarousel = (props) => {
  return (
    <div className="flex relative lg:col-span-9 w-full justify-center bg-gray-300 dark:bg-[#101010]">
      <div className="flex flex-col m-3 space-y-3 w-full justify-center">
        <div className='flex w-fit self-center items-center place-content-center'>
          {props.prevTrue ? <button onClick={props.prev} aria-label="slide backward" className="fixed z-30 ml-3 top-0 bottom-0 left-0 cursor-pointer">
            <FaChevronLeft className='text-5xl text-neutral-800 dark:text-gray-300' />
          </button> : ''}
          <img src={`${fetchExploreImages(props.currentImage)}`} className="h-full px-14 object-cover object-center rounded-lg" />
          {props.nextTrue ? <button onClick={props.next} aria-label="slide forward" className="fixed z-30 mr-3 top-0 bottom-0 right-96 cursor-pointer">
            <FaChevronRight className='text-5xl text-neutral-800 dark:text-gray-300' />
          </button> : ''}
        </div>
        <div className='flex w-fit flex-col self-center items-center space-y-3 place-content-center'>
          {props.secondaryImages.map((image, index) => (
            <img key={index} src={`${fetchExploreImages(image)}`} className="h-full px-14 object-cover object-center rounded-lg" />
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
          <GoChevronLeft className='h-12 w-20 -ml-5' />
        </button>
        <button
          onClick={() => moveNext()}
          className="hover:bg-violet-900/75 rounded-l-md text-white dark:text-gray-800 w-10 h-full text-center opacity-75 hover:opacity-100 disabled:opacity-25 disabled:cursor-not-allowed z-10 p-0 m-0 transition-all ease-in-out duration-300"
        >
          <GoChevronRight className='h-12 w-20 -ml-5' />
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

/*
<div className="flex items-center justify-center w-full h-full py-24 sm:py-8 px-4">
  <!--- more free and premium Tailwind CSS components at https://tailwinduikit.com/ --->
  <div className="w-full relative flex items-center justify-center">
    <button aria-label="slide backward" className="absolute z-30 left-0 ml-10 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer" id="prev">
      <svg className="dark:text-gray-900" width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 1L1 7L7 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <div className="w-full h-full mx-auto overflow-x-hidden overflow-y-hidden">
      <div id="slider" className="h-full flex lg:gap-8 md:gap-6 gap-14 items-center justify-start transition ease-out duration-700">
        <div className="flex flex-shrink-0 relative w-full sm:w-auto">
          <img src="https://i.ibb.co/fDngH9G/carosel-1.png" alt="black chair and white table" className="object-cover object-center w-full" />
          <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
            <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">Catalog 1</h2>
            <div className="flex h-full items-end pb-6">
              <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">Minimal Interior</h3>
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 relative w-full sm:w-auto">
          <img src="https://i.ibb.co/DWrGxX6/carosel-2.png" alt="sitting area" className="object-cover object-center w-full" />
          <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
            <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">Catalog 2</h2>
            <div className="flex h-full items-end pb-6">
              <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">Minimal Interior</h3>
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 relative w-full sm:w-auto">
          <img src="https://i.ibb.co/tCfVky2/carosel-3.png" alt="sitting area" className="object-cover object-center w-full" />
          <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
            <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">Catalog 2</h2>
            <div className="flex h-full items-end pb-6">
              <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">Minimal Interior</h3>
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 relative w-full sm:w-auto">
          <img src="https://i.ibb.co/rFsGfr5/carosel-4.png" alt="sitting area" className="object-cover object-center w-full" />
          <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
            <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">Catalog 2</h2>
            <div className="flex h-full items-end pb-6">
              <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">Minimal Interior</h3>
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 relative w-full sm:w-auto">
          <img src="https://i.ibb.co/fDngH9G/carosel-1.png" alt="black chair and white table" className="object-cover object-center w-full" />
          <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
            <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">Catalog 2</h2>
            <div className="flex h-full items-end pb-6">
              <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">Minimal Interior</h3>
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 relative w-full sm:w-auto">
          <img src="https://i.ibb.co/DWrGxX6/carosel-2.png" alt="sitting area" className="object-cover object-center w-full" />
          <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
            <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">Catalog 2</h2>
            <div className="flex h-full items-end pb-6">
              <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">Minimal Interior</h3>
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 relative w-full sm:w-auto">
          <img src="https://i.ibb.co/tCfVky2/carosel-3.png" alt="sitting area" className="object-cover object-center w-full" />
          <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
            <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">Catalog 2</h2>
            <div className="flex h-full items-end pb-6">
              <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">Minimal Interior</h3>
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 relative w-full sm:w-auto">
          <img src="https://i.ibb.co/rFsGfr5/carosel-4.png" alt="sitting area" className="object-cover object-center w-full" />
          <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
            <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">Catalog 2</h2>
            <div className="flex h-full items-end pb-6">
              <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">Minimal Interior</h3>
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 relative w-full sm:w-auto">
          <img src="https://i.ibb.co/fDngH9G/carosel-1.png" alt="black chair and white table" className="object-cover object-center w-full" />
          <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
            <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">Catalog 2</h2>
            <div className="flex h-full items-end pb-6">
              <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">Minimal Interior</h3>
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 relative w-full sm:w-auto">
          <img src="https://i.ibb.co/DWrGxX6/carosel-2.png" alt="sitting area" className="object-cover object-center w-full" />
          <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
            <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">Catalog 2</h2>
            <div className="flex h-full items-end pb-6">
              <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">Minimal Interior</h3>
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 relative w-full sm:w-auto">
          <img src="https://i.ibb.co/tCfVky2/carosel-3.png" alt="sitting area" className="object-cover object-center w-full" />
          <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
            <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">Catalog 2</h2>
            <div className="flex h-full items-end pb-6">
              <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">Minimal Interior</h3>
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 relative w-full sm:w-auto">
          <img src="https://i.ibb.co/rFsGfr5/carosel-4.png" alt="sitting area" className="object-cover object-center w-full" />
          <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
            <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white dark:text-gray-900">Catalog 2</h2>
            <div className="flex h-full items-end pb-6">
              <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">Minimal Interior</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button aria-label="slide forward" className="absolute z-30 right-0 mr-10 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400" id="next">
      <svg className="dark:text-gray-900" width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L7 7L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</div>
<script>
    let defaultTransform = 0;
function goNext() {
  defaultTransform = defaultTransform - 398;
  var slider = document.getElementById("slider");
  if (Math.abs(defaultTransform) >= slider.scrollWidth / 1.7)
    defaultTransform = 0;
  slider.style.transform = "translateX(" + defaultTransform + "px)";
}
next.addEventListener("click", goNext);
function goPrev() {
  var slider = document.getElementById("slider");
  if (Math.abs(defaultTransform) === 0) defaultTransform = 0;
  else defaultTransform = defaultTransform + 398;
  slider.style.transform = "translateX(" + defaultTransform + "px)";
}
prev.addEventListener("click", goPrev);
</script>
*/