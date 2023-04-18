import Button from 'react-bootstrap/Button'
import React from 'react'
import MainMenu from '../Home Components/MainMenu.js'
import MainCart from '../Home Components/MainCart.js'
import styles from "./Home.module.css"

function Home() {
  return (
   <div className={`${styles.home} d-flex flex-shrink-1 px-0 py-0 bg-danger overflow-hidden`}>
    <MainMenu/>
    <MainCart/>
   </div>
   
  )
}

export default Home


