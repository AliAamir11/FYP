import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropDown from "react-bootstrap/NavDropdown";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import { useContext, useEffect, useState } from "react";
import { Store } from "./Store";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import SignupScreen from "./screens/SignupScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { getError } from "./utils";
import axios from "axios";
import Button from "react-bootstrap/Button";
import SearchBox from "./components/SearchBox";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import DashboardScreen from "./screens/DashboardScreen";
import BookListScreen from "./screens/BookListScreen";
import BookEditScreen from "./screens/BookEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/OrderEditScreen";
import FavouriteList from "./screens/FavouriteList";
import { FaBell } from "react-icons/fa";
import SearchScreen from "./screens/SearchScreen";


function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/books/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? "d-flex flex-column site-container active-cont"
            : "d-flex flex-column site-container"
        }
      >
        {" "}
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>Event Organization System</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto w-100  justify-content-end">
                  {userInfo && !userInfo.isAdmin && (
                    <Link to="/cart" className="nav-link">
                      Cart
                      {cart.cartItems.length > 0 && (
                        <Badge pill bg="danger">
                          1
                        </Badge>
                      )}
                    </Link>
                  )}
                  {userInfo ? (
                    <NavDropDown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropDown.Item>User Profile</NavDropDown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropDown.Item>Booking History</NavDropDown.Item>
                      </LinkContainer>
                      <LinkContainer to="/favouritelist">
                        <NavDropDown.Item>Favourite List</NavDropDown.Item>
                      </LinkContainer>
                      <NavDropDown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropDown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropDown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropDown.Item>Dashboard</NavDropDown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/books">
                        <NavDropDown.Item>Venues</NavDropDown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropDown.Item>Bookings</NavDropDown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropDown.Item>Users</NavDropDown.Item>
                      </LinkContainer>
                    </NavDropDown>
                  )}
                </Nav>
                <Nav>
                  <NavDropDown title={<FaBell />} id="basic-nav-dropdown">
                    <NavDropDown.Item href="#action/3.1">
                      Notification 1
                    </NavDropDown.Item>
                    <NavDropDown.Item href="#action/3.2">
                      Notification 2
                    </NavDropDown.Item>
                    <NavDropDown.Divider />
                    <NavDropDown.Item href="#action/3.3">
                      See All Notifications
                    </NavDropDown.Item>
                  </NavDropDown>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? "active-nav side-navbar d-flex justify-content-between flex-wrap flex-column"
              : "side-navbar d-flex justify-content-between flex-wrap flex-column"
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={`/search/${category}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main className="mainDiv">
          <Container className="mt-3">
            <Routes>
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/book/:slugs" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/favouritelist" element={<FavouriteList />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/books"
                element={
                  <AdminRoute>
                    <BookListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/book/:id"
                element={
                  <AdminRoute>
                    <BookEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer className="footerClass">
          <div className="footerDiv">All Rights Reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
