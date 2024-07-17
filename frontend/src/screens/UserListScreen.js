import axios from 'axios' // Importation de la bibliothèque pour les requêtes HTTP
import React, { useContext, useEffect, useReducer } from 'react' // Importation des hooks nécessaires depuis React
import Button from 'react-bootstrap/Button' // Composant Button de react-bootstrap
import { Helmet } from 'react-helmet-async' // Pour gérer les balises <head>
import { useNavigate } from 'react-router-dom' // Hook pour naviguer programatiquement
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
      return {
        ...state,
        users: action.payload,
        loading: false,
      }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false }
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      }
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false }
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false }
    default:
      return state
  }
}

export default function UserListScreen() {
  const navigate = useNavigate() // Hook pour naviguer programatiquement
  // Utilisation de useReducer pour gérer l'état du chargement, des erreurs, des utilisateurs, de la suppression, et de la réussite de la suppression
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    })

  const { state } = useContext(Store) // Utilisation du contexte Store
  const { userInfo } = state // Extraction des informations de l'utilisateur depuis l'état global

  // Utilisation de useEffect pour récupérer les données des utilisateurs et gérer les états de suppression
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`http://localhost:5000/api/users`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }, // Envoi du token pour l'autorisation
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        })
      }
    }
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' })
    } else {
      fetchData()
    }
  }, [userInfo, successDelete])

  // Fonction pour supprimer un utilisateur
  const deleteHandler = async (user) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' })
        await axios.delete(`http://localhost:5000/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }, // Envoi du token pour l'autorisation
        })
        toast.success('user deleted successfully') // Notification de succès
        dispatch({ type: 'DELETE_SUCCESS' })
      } catch (error) {
        toast.error(getError(error)) // Notification d'erreur
        dispatch({
          type: 'DELETE_FAIL',
        })
      }
    }
  }

  return (
    <div>
      <Helmet>
        <title>Users</title> {/* Définition du titre de la page */}
      </Helmet>
      <h1>Users</h1> {/* Titre de la page */}
      {loadingDelete && <LoadingBox></LoadingBox>}{' '}
      {/* Affichage du composant de chargement lors de la suppression */}
      {loading ? (
        <LoadingBox></LoadingBox> // Affichage du composant de chargement lors de la récupération des utilisateurs
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox> // Affichage du message d'erreur
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>IS ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td> {/* Affichage de l'ID de l'utilisateur */}
                <td>{user.name}</td> {/* Affichage du nom de l'utilisateur */}
                <td>{user.email}</td>{' '}
                {/* Affichage de l'email de l'utilisateur */}
                <td>{user.isAdmin ? 'YES' : 'NO'}</td>{' '}
                {/* Affichage du statut admin de l'utilisateur */}
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => navigate(`/admin/user/${user._id}`)}
                  >
                    Edit {/* Bouton pour éditer l'utilisateur */}
                  </Button>
                  &nbsp;
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => deleteHandler(user)}
                  >
                    Delete {/* Bouton pour supprimer l'utilisateur */}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
