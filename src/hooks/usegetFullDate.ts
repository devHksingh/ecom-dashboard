import { useEffect, useState } from "react"

const useGetFullDate = () => {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")

  function getTimeAndDate() {
    const currentDate = new Date()  
    const arr = String(currentDate).split(" ")
    setDate(`${arr[0]}, ${arr[1]} ${arr[2]} ${arr[3]}`)
    setTime(`${arr[4]}`)
  }

  useEffect(() => {
    
    getTimeAndDate()
    
    const timer = setInterval(() => {
      getTimeAndDate()
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])
  
  return { fullDate: date, time }  
}

export default useGetFullDate