import axios from 'axios' // Importation de la bibliothèque pour les requêtes HTTP
import React, { useContext, useEffect, useReducer, useState } from 'react' // Importation des hooks nécessaires depuis React
import Form from 'react-bootstrap/Form' // Composant Form de react-bootstrap
import Button from 'react-bootstrap/Button' // Composant Button de react-bootstrap
import Container from 'react-bootstrap/Container' // Composant Container de react-bootstrap
import { Helmet } from 'react-helmet-async' // Pour gérer les balises <head>
import { useNavigate, useParams } from 'react-router-dom' // Hooks pour la navigation et les paramètres de route
import { toast } from 'react-toastify' // Importation de la bibliothèque pour afficher les notifications toast
import LoadingBox from '../components/LoadingBox' // Composant pour afficher le chargement
import MessageBox from '../components/MessageBox' // Composant pour afficher les messages d'erreur
import { Store } from '../Store' // Importation du contexte personnalisé Store
import { getError } from '../utils' // Importation de la fonction utilitaire pour gérer les erreurs

// Définition du reducer pour gérer les états et actions
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true }
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false }
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false }
    default:
      return state
  }
}

export default function UserEditScreen() {
  // Utilisation de useReducer pour gérer l'état du chargement, des erreurs et des mises à jour
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  })

  const { state } = useContext(Store) // Utilisation du contexte Store
  const { userInfo } = state // Extraction des informations de l'utilisateur depuis l'état global

  const params = useParams() // Hook pour récupérer les paramètres de la route
  const { id: userId } = params // Extraction de l'ID de l'utilisateur depuis les paramètres
  const navigate = useNavigate() // Hook pour naviguer programatiquement

  // Utilisation de useState pour gérer l'état des champs du formulaire
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  // Utilisation de useEffect pour récupérer les données de l'utilisateur à éditer
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }, // Envoi du token pour l'autorisation
        })
        setName(data.name)
        setEmail(data.email)
        setIsAdmin(data.isAdmin)
        dispatch({ type: 'FETCH_SUCCESS' })
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        })
      }
    }
    fetchData()
  }, [userId, userInfo])

  // Fonction pour gérer la soumission du formulaire
  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      dispatch({ type: 'UPDATE_REQUEST' })
      await axios.put(
        `/api/users/${userId}`,
        { _id: userId, name, email, isAdmin },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` }, // Envoi du token pour l'autorisation
        }
      )
      dispatch({
        type: 'UPDATE_SUCCESS',
      })
      toast.success('User updated successfully') // Notification de succès
      navigate('/admin/users') // Redirection vers la liste des utilisateurs
    } catch (error) {
      toast.error(getError(error)) // Notification d'erreur
      dispatch({ type: 'UPDATE_FAIL' })
    }
  }

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit User {userId}</title> {/* Définition du titre de la page */}
      </Helmet>
      <h1>Edit User {userId}</h1> {/* Titre de la page */}
      {loading ? (
        <LoadingBox></LoadingBox> // Affichage du composant de chargement
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox> // Affichage du message d'erreur
      ) : (
        <Form onSubmit={submitHandler}>
          {' '}
          {/* Formulaire pour éditer l'utilisateur */}
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label> {/* Étiquette pour le champ du nom */}
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />{' '}
            {/* Champ de saisie pour le nom */}
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>{' '}
            {/* Étiquette pour le champ de l'email */}
            <Form.Control
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />{' '}
            {/* Champ de saisie pour l'email */}
          </Form.Group>
          <Form.Check
            className="mb-3"
            type="checkbox"
            id="isAdmin"
            label="isAdmin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />{' '}
          {/* Champ de saisie pour définir l'utilisateur en tant qu'admin */}
          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Update {/* Bouton pour soumettre le formulaire */}
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}{' '}
            {/* Affichage du composant de chargement lors de la mise à jour */}
          </div>
        </Form>
      )}
    </Container>
  )
}
