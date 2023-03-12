import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import axios from "axios";
import { useContext, useReducer } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { AiOutlinePlus } from "react-icons/ai";

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_REQUEST':
      return { ...state, loading: true };
    case 'ADD_SUCCESS':
      return {
        ...state,
        loading: false,
      };
    case 'ADD_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

function Book(props) {
  const [{loading, error}, dispatch] = useReducer(reducer, {
    error: '',  loading: true
  });
  const { book } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const { userInfo } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === book._id);
    if (existItem) {
      toast.error("Sorry Event is already in the cart");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item },
    });
  };
  const addToFavouriteHandler = async (item) => {
    try {
      dispatch({ type: 'ADD_REQUEST' });
      const { data } = await axios.post(
        `/api/users/${userInfo._id}/favorites`,
        {item},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      toast.success('Event added to your favourites');
      dispatch({ type: 'ADD_SUCCESS' });
    } catch (err) {
      toast.error(err.response.data);
      dispatch({
        type: 'ADD_FAIL',
      });
    }
  };
  return (
    <Card className="venueCard">
      <Link to={`/book/${book.slugs}`}>
        <img src={book.image} className="card-img-top" alt={book.title}></img>
      </Link>
      <Card.Body>
        <Link to={`/book/${book.slugs}`}>
          <Card.Title>{book.title}</Card.Title>
        </Link>
        <Rating rating={book.rating} numReviews={book.numberOfReviews} />

        <Card.Text>${book.price}</Card.Text>
        {book.stock === 0 ? (
          <Button variant="light" disabled>
            Unavailable
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(book)} className="mx-2">
            Book
          </Button>
        )}
        <Button onClick={() => addToFavouriteHandler(book)}>
          <AiOutlinePlus /> Favourite
        </Button>
      </Card.Body>
    </Card>
  );
}
export default Book;
