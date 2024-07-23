import React from 'react'
import MessageBox from '../components/MessageBox'
import { Link } from 'react-router-dom'
export default function ThankYouScreen() {
  return (
    <div className="thank-you-container">
      <h1>Merci pour votre achat!</h1>
      <MessageBox variant="dark">
        <p>
          Nous avons bien reçu votre commande et nous la traitons actuellement.{' '}
        </p>
        <Link to="/">Acceuil</Link>
      </MessageBox>
    </div>
  )
}
