import React from 'react'
import { Container } from 'react-bootstrap'
import styles from "./MainMenu.module.css"
import Categories from './Categories'
import Items from './Items'

function MainMenu() {
  return (
    <div className={styles.mainMenu}>
      <div className={styles.itemSearchContainer}>
         <input type="text" className={`${styles.itemSearch} border-0 ps-3 py-1`} placeholder='Search item'/>
      </div>
      <div className='displayMenu d-flex'>
         <Categories/>
         <Items/>
      </div>

    </div>
  )
}

export default MainMenu