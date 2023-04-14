import React from 'react'
import styles from "./PersonCount.module.css"
import { useDispatch,useSelector } from 'react-redux'
import { modifyCartData } from '../Redux/finalOrderSlice'

function PersonCount({showDetailType}) {

  const dispatch = useDispatch()
  const {personCount} = useSelector(state => state.finalOrder)

  const handleChange = (e) =>{
   let personCount = e.target.value
    dispatch(modifyCartData({personCount}))
  }

   let showPersonCount = showDetailType==="personCount" ? `${styles.show} ${styles.personCount} ` :  `${styles.personCount}`
  return (
   <div className={showPersonCount}>

      <span className='mx-2'>please enter No. of Person</span><input type="number" min="0" value={personCount} onChange={(e)=>handleChange(e)}/>
    </div>
  )
}

export default PersonCount