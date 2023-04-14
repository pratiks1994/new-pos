import React from 'react'
import styles from "./TableNumber.module.css"
import { useSelector,useDispatch } from 'react-redux'
import { modifyCartData } from '../Redux/finalOrderSlice'


function TableNumber({showDetailType}) {

  let {tableNumber} = useSelector(state => state.finalOrder)
  let dispatch = useDispatch()

  const hanndleChange = (e) => {

    let tableNumber = e.target.value ;
    dispatch(modifyCartData({tableNumber}))

  }


 
  let showTableNumber = showDetailType==="tableNumber" ? `${styles.show} ${styles.tableNumber}` : `${styles.tableNumber}`

  return (
    <div className={showTableNumber}>
      <span className='mx-2'>please enter Table No.</span><input type="number" min="0" value={tableNumber} onChange={(e)=>hanndleChange(e)}/>
    </div>
  )
}

export default TableNumber