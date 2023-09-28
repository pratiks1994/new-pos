import React from 'react'
import styles from "./OrderComment.module.css"
import { useDispatch, useSelector } from "react-redux";
import { modifyCartData } from "../Redux/finalOrderSlice";

function OrderComment({showDetailType}) {
  
  let {orderComment} = useSelector(state => state.finalOrder)
  let dispatch = useDispatch()

  const handleChange = (e) =>{
    let orderComment= e.target.value
    dispatch(modifyCartData({orderComment}))
  }


   let showOrderComment = showDetailType==="orderComment" ? `${styles.show} ${styles.orderComment}`:`${styles.orderComment}`

   return (
     <div className={showOrderComment}>
       <label className='mx-2'>Order Comment :</label>
       <textarea value={orderComment} onChange={e=>handleChange(e)}/>
     </div>
   )
 }


export default OrderComment