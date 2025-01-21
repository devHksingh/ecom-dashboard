import { ChevronsUpDown } from "lucide-react"

const AccountToggle = () => {
  return (
    <div className="pb-4 mt-2 mb-4 border-b border-stone-300">
         <button className="flex p-0.5 hover:bg-copy-primary/10 rounded transition-colors  gap-2 w-full items-center justify-between">
        <img
          src="https://api.dicebear.com/9.x/notionists/svg"
          alt="avatar"
          className="rounded shadow size-8 shrink-0 bg-violet-500"
        />
        <div className="text-start ml-[-14%]">
          <span className="block text-sm font-bold text-copy-primary">UserName</span>
          <span className="block text-xs font-medium text-copy-secondary">Email Id</span>
        </div>

        <ChevronsUpDown strokeWidth={1} className="ml-5 text-copy-primary" />
      </button>
    </div>
  )
}

export default AccountToggle  