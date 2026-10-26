import { useEffect, useState } from "react"

export default function Loader() {
  const [off, setOff] = useState(false)

  useEffect(() => {
    const timers = [setTimeout(() => setOff(true), 450), setTimeout(() => setOff(true), 2800)]
    const onLoad = () => setTimeout(() => setOff(true), 450)
    window.addEventListener("load", onLoad)
    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener("load", onLoad)
    }
  }, [])

  return (
    <div id="loader" className={off ? "off" : undefined}>
      <span>
        Earthy<i>Roots</i> Farm
      </span>
    </div>
  )
}
