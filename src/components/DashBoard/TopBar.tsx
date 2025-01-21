
const TopBar = () => {
  return (
    <div className="px-4 pb-4 mt-2 mb-4 border-b border-stone-200">
      <div className="flex items-center justify-between p-0.5">
        <div>
          <span className="block text-sm font-bold">🚀 Good morning, User!</span>
          <span className="block text-xs text-copy-primary/70">
            Tuesday, Aug 8th 2023
          </span>
        </div>

        <button className="flex text-sm items-center gap-2 bg-stone-100 transition-colors hover:bg-violet-100 hover:text-violet-700 px-3 py-1.5 rounded">
          {/* <FiCalendar /> */}
          <span>login/logout</span>
        </button>
      </div>
    </div>
  )
}

export default TopBar