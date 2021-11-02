import type { NextPage } from 'next'
import React,{useState,useEffect,useRef} from 'react'
import axios from "axios"
import styles from '../styles/Home.module.css'


const api = "http://quotes.rest/qod.json"
const Home: NextPage = () => {
   const [phrase, setPhrase] = useState("understood each other in a way, me and my mom and my dad. As screwed up as we all were, we did understand each other. My mother, she knew what it's like to feel your entire life like you're drowning with the exception of these moments, these very rare, brief instances, in which you suddenly remember... you can swim.")
   const [distance, setDistance] = useState(0)
   const [current, setCurrent] = useState(phrase.split(" ")[0])
   const [remaining, setRemaining] = useState(phrase.split(" ").slice(1).join(" "))
   const [completed, setCompleted] = useState("")
   const [hasError, setHasError] = useState(false)
   const [timeStart, setTimeStart] = useState(Date.now())
   const [speed, setSpeed] = useState(0)
   const [totalDistance, setTotalDistance] = useState(5)
   const [velocity, setVelocity]  = useState(0)

   useEffect(()=> {
     let widthElem = document.getElementById("road")
     let width
     if(widthElem) width =  window.getComputedStyle((widthElem as HTMLElement)).width
     if(width){
       setTotalDistance(Number(width.substr(0, width.length - 2)) - 70)
       setVelocity(totalDistance/phrase.length)
     }

     },[])

   const handleType = (e : React.ChangeEvent<HTMLInputElement>):void => {
     if(e.target.getAttribute("data-started") === "false") {
       setTimeStart(Date.now())
       e.target.setAttribute("data-started","true")
     }

      const val = e.target.value
      if(val.trim() != current.substr(0,val.length)) {
           setHasError(true)
      }else {
        setHasError(false)
      }
      if(val.substr(val.length - 1) === " ") {
        if(current === val.trim()) {
          setCompleted(comp => comp + " " + current)
          setCurrent(remaining.split(" ")[0])
          setRemaining(remaining => remaining.split(" ").slice(1).join(" "))
          e.target.value = ""
          setDistance(completed.length * velocity)
          console.log(velocity);
          let words = completed.length / 4
          setSpeed(Math.ceil((60000 * words)/(Date.now() - timeStart)))
        }
      }
   }

   async function fetchData()  {
     try {
       await axios.get('https://api.quotable.io/random')
       .then(res => {
         setPhrase(res.data.content)
       })
     } catch (error) {
      alert("something went wrong")
    }
   }

   const resetRace = ():void => {
         fetchData()
         setCurrent(phrase.split(" ")[0])
         setRemaining(phrase.split(" ").slice(1).join(" "))
         setCompleted("")
         setDistance(0)
         setHasError(false)
         const inputElem: HTMLInputElement = document.getElementById("textInput") as HTMLInputElement
         if(inputElem) {
           inputElem.value = ""
           inputElem.focus()
         }
         setSpeed(0)
          console.log(totalDistance,phrase.length)
           setVelocity(totalDistance/phrase.length)
         let elem = document.getElementById("textInput")
         if (elem){
            elem.setAttribute("data-started","false")
         }

   }

  return (
   <>
  <header className = {styles.headerContainer}>
  <h1 className = {styles.primaryColor}>Typeracerrrr</h1>
  </header>
  <main className = {styles.mainContainer}>
  <section>
  <div className = {styles.road} id = "road">
  <img src = "./basic-white.svg"  className = {styles.car} style = {{left: `${distance}px`}}/>
  <span className = {styles.speed} id = "speed">{speed}WPM</span>
  </div>
  </section>
  <hr />
  <section>
  <div className = {styles.textContainer}>
  <p><span id = "completed" className = {styles.completed}>{completed} </span>
  <span id = "current" className = {styles.current}>{current} </span>
  <span id = "remaining" className = {styles.remaining}>{remaining} </span></p>
  <input type = "text"  className = {`${styles.textInput} ${hasError ? styles.inputError: ""}`}
   onChange = {handleType} id = "textInput" disabled = {current ? false : true} data-started = "false"/>
  </div>
   <button className = {styles.nextButton} onClick = {resetRace}>Race again</button>
  </section>
  </main>
   </>
 )
}


export default Home
