import { BrowserRouter, Link, Route, Routes } from 'react-router-dom' // Importation des composants de react-router-dom pour la navigation
import { ToastContainer } from 'react-toastify' // Importation des composants pour les notifications
import 'react-toastify/dist/ReactToastify.css' // Importation du fichier CSS pour les notifications
import HomeScreen from './screens/HomeScreen' // Importation du composant HomeScreen
import ProductScreen from './screens/ProductScreen' // Importation du composant ProductScreen
import Navbar from 'react-bootstrap/Navbar' // Importation du composant Navbar de react-bootstrap
import Badge from 'react-bootstrap/Badge' // Importation du composant Badge de react-bootstrap
import Nav from 'react-bootstrap/Nav' // Importation du composant Nav de react-bootstrap
import NavDropdown from 'react-bootstrap/NavDropdown' // Importation du composant NavDropdown de react-bootstrap
import Container from 'react-bootstrap/Container' // Importation du composant Container de react-bootstrap
import { LinkContainer } from 'react-router-bootstrap' // Importation du composant LinkContainer de react-router-bootstrap
import { useContext, useState } from 'react' // Importation des hooks nécessaires depuis React
import { Store } from './Store' // Importation du contexte personnalisé Store
import CartScreen from './screens/CartScreen' // Importation du composant CartScreen
import SigninScreen from './screens/SigninScreen' // Importation du composant SigninScreen
import ShippingAddressScreen from './screens/ShippingAddressScreen' // Importation du composant ShippingAddressScreen
import SignupScreen from './screens/SignupScreen' // Importation du composant SignupScreen
import PaymentMethodScreen from './screens/PaymentMethodScreen' // Importation du composant PaymentMethodScreen

import SearchBox from './components/SearchBox' // Importation du composant SearchBox
import SearchScreen from './screens/SearchScreen' // Importation du composant SearchScreen
import ProfileScreen from './screens/ProfileScreen' // Importation du composant ProfileScreen
import ProductListScreen from './screens/ProductListScreen' // Importation du composant ProductListScreen
import ProductEditScreen from './screens/ProductEditScreen' // Importation du composant ProductEditScreen
import UserListScreen from './screens/UserListScreen' // Importation du composant UserListScreen
import UserEditScreen from './screens/UserEditScreen' // Importation du composant UserEditScreen

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store) // Utilisation du hook useContext pour accéder au contexte Store
  const { cart, userInfo } = state // Extraction des informations du panier et de l'utilisateur depuis l'état global

  // Fonction pour gérer la déconnexion de l'utilisateur
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' })
    localStorage.removeItem('userInfo')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
    localStorage.removeItem('cartItems')
    window.location.href = '/signin'
  }

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false) // Utilisation du hook useState pour gérer l'état de la barre latérale

  // Utilisation du hook useEffect pour récupérer les catégories depuis l'API

  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar className="custom-navbar" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>SCENT</Navbar.Brand>
              </LinkContainer>
              <SearchBox />
              <Nav className="me-auto">
                <Link to="/cart" className="nav-link">
                  PANIER
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="success">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Modifier Profil</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Order History</NavDropdown.Item>
                    </LinkContainer>

                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#signout"
                      onClick={signoutHandler}
                    >
                      Sign Out
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                )}
                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title="Admin" id="admin-nav-dropdown">
                    <LinkContainer to="/admin/dashboard">
                      <NavDropdown.Item>Dashboard</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to="/admin/orders">
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/products">
                      <NavDropdown.Item>Produits</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to="/admin/users">
                      <NavDropdown.Item>Utilisateurs</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
              </Nav>
            </Container>
          </Navbar>
        </header>

        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/" element={<HomeScreen />} />
              <Route path="/admin/products" element={<ProductListScreen />} />
              <Route
                path="/admin/product/:id"
                element={<ProductEditScreen />}
              />
              <Route path="/admin/users" element={<UserListScreen />} />
              <Route path="/admin/user/:id" element={<UserEditScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
export default App
