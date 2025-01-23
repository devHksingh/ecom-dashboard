import { useEffect, useState } from "react"

const useGetFullDate = () => {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  
  const [text,setText]= useState("")
  function getTimeAndDate() {
    const currentDate = new Date()
    const arr = String(currentDate).split(" ")
    setDate(`${arr[0]}, ${arr[1]} ${arr[2]} ${arr[3]}`)
    setTime(`${String(currentDate.toLocaleString('en-US')).split(',')[1]}`)
    const hrs = Number(arr[4].split(':')[0])
    if (hrs >= 0 && hrs < 12) {
      setText("morning")
    } else if (hrs === 12) {
      setText("noon")
    } else if (hrs > 12 && hrs < 17) {
      setText("afternoon")
    } else if (hrs >= 17 && hrs < 21) {  
      setText("evening")
    } else {
      setText("night")
    }
    
    
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

  return { fullDate: date, time, text }
}

export default useGetFullDate