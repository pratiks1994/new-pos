import React from 'react'

function Invoice({order}) {
  return (
    <div>{order.bill_no}</div>
  )
}

export default Invoice