import React, { useContext, useEffect, useReducer } from 'react' // Importation des hooks nécessaires depuis React
import axios from 'axios' // Importation de la bibliothèque pour les requêtes HTTP
import { useNavigate } from 'react-router-dom' // Hook pour naviguer programatiquement
import Row from 'react-bootstrap/Row' // Composant Row de react-bootstrap
import Col from 'react-bootstrap/Col' // Composant Col de react-bootstrap
import Button from 'react-bootstrap/Button' // Composant Button de react-bootstrap
import { toast } from 'react-toastify' // Importation de la bibliothèque pour afficher les notifications toast
import { Store } from '../Store' // Importation du contexte personnalisé Store
import LoadingBox from '../components/LoadingBox' // Composant pour afficher le chargement
import MessageBox from '../components/MessageBox' // Composant pour afficher les messages d'erreur
import { getError } from '../utils' // Importation de la fonction utilitaire pour gérer les erreurs

// Définition du reducer pour gérer les états et actions
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload,
        loading: false,
      }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true }
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false }
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false }
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false }
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true }
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false }
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false }
    default:
      return state
  }
}

export default function ProductListScreen() {
  // Utilisation de useReducer pour gérer l'état des produits, du chargement, des erreurs, de la création et de la suppression
  const [
    { loading, error, products, loadingCreate, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  })

  const navigate = useNavigate() // Hook pour naviguer programatiquement
  const { state } = useContext(Store) // Utilisation du contexte Store
  const { userInfo } = state // Extraction des informations de l'utilisateur depuis l'état global

  // Utilisation de useEffect pour récupérer les données des produits et gérer les états de suppression
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/products/admin', {
          headers: { Authorization: `Bearer ${userInfo.token}` }, // Envoi du token pour l'autorisation
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' })
    } else {
      fetchData()
    }
  }, [userInfo, successDelete])

  // Fonction pour créer un produit
  const createHandler = async () => {
    if (window.confirm('Are you sure to create?')) {
      try {
        dispatch({ type: 'CREATE_REQUEST' })
        const { data } = await axios.post(
          '/api/products',
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        )
        toast.success('Product created successfully') // Notification de succès
        dispatch({ type: 'CREATE_SUCCESS' })
        navigate(`/admin/product/${data.product._id}`) // Redirection vers la page d'édition du nouveau produit
      } catch (err) {
        toast.error(getError(err)) // Notification d'erreur
        dispatch({
          type: 'CREATE_FAIL',
        })
      }
    }
  }

  // Fonction pour supprimer un produit
  const deleteHandler = async (product) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' })
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        })
        toast.success('Product deleted successfully') // Notification de succès
        dispatch({ type: 'DELETE_SUCCESS' })
      } catch (err) {
        toast.error(getError(err)) // Notification d'erreur
        dispatch({ type: 'DELETE_FAIL', payload: getError(err) })
      }
    }
  }

  return (
    <div>
      <Row>
        <Col>
          <h1>Products</h1> {/* Titre de la page */}
        </Col>
        <Col className="col text-end">
          <div>
            <Button type="button" onClick={createHandler}>
              Create Product {/* Bouton pour créer un nouveau produit */}
            </Button>
          </div>
        </Col>
      </Row>
      {loadingCreate && <LoadingBox></LoadingBox>}{' '}
      {/* Affichage du chargement lors de la création */}
      {loadingDelete && <LoadingBox></LoadingBox>}{' '}
      {/* Affichage du chargement lors de la suppression */}
      {loading ? (
        <LoadingBox></LoadingBox> // Affichage du chargement lors de la récupération des produits
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox> // Affichage de l'erreur si la récupération échoue
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                    >
                      Edit {/* Bouton pour éditer le produit */}
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => deleteHandler(product)}
                    >
                      Delete {/* Bouton pour supprimer le produit */}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
