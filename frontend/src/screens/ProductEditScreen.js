import React, { useContext, useEffect, useReducer, useState } from 'react' // Importation des hooks nécessaires depuis React
import { useNavigate, useParams } from 'react-router-dom' // Importation des hooks pour la navigation et les paramètres de route
import { toast } from 'react-toastify' // Importation de la bibliothèque pour afficher les notifications toast
import axios from 'axios' // Importation de la bibliothèque pour les requêtes HTTP
import { Store } from '../Store' // Importation du contexte personnalisé Store
import { getError } from '../utils' // Importation de la fonction utilitaire pour gérer les erreurs
import Container from 'react-bootstrap/Container' // Importation du composant Container de react-bootstrap
import Form from 'react-bootstrap/Form' // Importation du composant Form de react-bootstrap
import { Helmet } from 'react-helmet-async' // Pour gérer les balises <head>
import LoadingBox from '../components/LoadingBox' // Composant pour afficher le chargement
import MessageBox from '../components/MessageBox' // Composant pour afficher les messages d'erreur
import Button from 'react-bootstrap/Button' // Importation du composant Button de react-bootstrap

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

export default function ProductEditScreen() {
  const navigate = useNavigate() // Hook pour naviguer programatiquement
  const params = useParams() // Hook pour récupérer les paramètres de la route
  const { id: productId } = params // Extraction de l'ID du produit depuis les paramètres

  const { state } = useContext(Store) // Utilisation du contexte Store
  const { userInfo } = state // Extraction des informations de l'utilisateur depuis l'état global

  // Utilisation de useReducer pour gérer l'état du chargement, des erreurs et des mises à jour
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  })

  // Utilisation de useState pour gérer l'état des champs du formulaire
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState('')
  const [brand, setBrand] = useState('')
  const [description, setDescription] = useState('')

  // Utilisation de useEffect pour récupérer les données du produit à éditer
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }, // Envoi du token pour l'autorisation
        })
        setName(data.name)
        setSlug(data.slug)
        setPrice(data.price)
        setImage(data.image)
        setCategory(data.category)
        setCountInStock(data.countInStock)
        setBrand(data.brand)
        setDescription(data.description)
        dispatch({ type: 'FETCH_SUCCESS' })
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        })
      }
    }
    fetchData()
  }, [productId, userInfo])

  // Fonction pour gérer la soumission du formulaire
  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      dispatch({ type: 'UPDATE_REQUEST' })
      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          image,
          category,
          brand,
          countInStock,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` }, // Envoi du token pour l'autorisation
        }
      )
      dispatch({ type: 'UPDATE_SUCCESS' })
      toast.success('Product updated successfully') // Notification de succès
      navigate('/admin/products') // Redirection vers la liste des produits administrables
    } catch (err) {
      toast.error(getError(err)) // Notification d'erreur
      dispatch({ type: 'UPDATE_FAIL' })
    }
  }

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Product {productId}</title>{' '}
        {/* Définition du titre de la page */}
      </Helmet>
      <h1>Edit Product {productId}</h1> {/* Titre de la page */}
      {loading ? (
        <LoadingBox></LoadingBox> // Composant de chargement
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox> // Composant d'erreur avec le message
      ) : (
        <Form onSubmit={submitHandler}>
          {' '}
          {/* Formulaire pour éditer le produit */}
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image File</Form.Label>
            <Form.Control
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  )
}
