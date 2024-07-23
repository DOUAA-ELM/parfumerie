import React, { useEffect, useReducer, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { Store } from '../Store'
import { getError } from '../utils'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export default function OrderScreen() {
  const { id: orderId } = useParams()
  const navigate = useNavigate()
  const { state } = useContext(Store)
  const { userInfo } = state

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  })

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        )
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }

    if (!userInfo) {
      navigate('/login')
    } else {
      fetchOrder()
    }
  }, [orderId, userInfo, navigate])

  return (
    <div>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <h1>Order Details</h1>
          <div>
            <h2>Order ID: {order._id}</h2>
            <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Total Price: ${order.totalPrice.toFixed(2)}</p>

            <h3>Shipping Address</h3>
            <p>
              <strong>Name:</strong> {order.shippingAddress.fullName} <br />
              <strong>Address:</strong> {order.shippingAddress.address},{' '}
              {order.shippingAddress.city}, {order.shippingAddress.postalCode},{' '}
              {order.shippingAddress.country}
            </p>
            <h3>Payment Method</h3>
            <p>
              <strong>Method:</strong> {order.paymentMethod}
            </p>
            <h3>User</h3>
            <p>
              <strong>Name:</strong> {order.user ? order.user.name : ''}
            </p>
            <h3>Order Items:</h3>
            <ul>
              {order.orderItems.map((item) => (
                <li key={item._id}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-fluid rounded img-thumbnail"
                  />
                  {item.name} - Quantity: {item.quantity} - Price: $
                  {item.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
