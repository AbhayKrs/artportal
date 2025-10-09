const SimpleGrid = ({ cols, children }) => {
    return (
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {children}
        </div>
    )
}

export default SimpleGrid;

