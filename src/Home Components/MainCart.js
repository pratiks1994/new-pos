import React from 'react'
import { Container } from 'react-bootstrap'
import styles from  "./MainCart.module.css"
import OrderArea from './OrderArea'
import OrderPayment from './OrderPayment'
import OrderType from './OrderType'
import { useSelector } from 'react-redux'
import { useCallback } from 'react'

function MainCart() {
   const isCartActionDisable = useSelector(state => state.UIActive.isCartActionDisable)

  return (
   <div className={`${styles.mainCart} d-flex flex-column`} style={isCartActionDisable ? {pointerEvents:"none",color:"gray"} : null}>
    <OrderType/>
    <OrderArea/>
    <OrderPayment/>
 </div>
  )
}

export default MainCart