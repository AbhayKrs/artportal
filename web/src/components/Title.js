
const Title = ({ text }) => {
    return (
        <div className='relative w-fit mb-2'>
            <h2 className='font-medium text-2xl text-neutral-800 dark:text-gray-300'>{text}</h2>
            <div className='absolute h-1 w-8 bottom-[-3px] left-0 bg-neutral-800 dark:bg-gray-300 rounded-md'></div>
        </div>
    )
}

export default Title

