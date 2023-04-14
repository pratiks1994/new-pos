import React from 'react'
import { Container } from 'react-bootstrap'
import styles from  "./MainCart.module.css"
import OrderArea from './OrderArea'
import OrderPayment from './OrderPayment'
import OrderType from './OrderType'
import { useSelector } from 'react-redux'
import { useCallback } from 'react'

function MainCart() {

  return (
   <div className={`${styles.mainCart} d-flex flex-column`}>
    <OrderType/>
    <OrderArea/>
    <OrderPayment/>
 </div>
  )
}

export default MainCart