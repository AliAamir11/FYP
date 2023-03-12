import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import MessageBox from '../components/MessageBox';
import { Link, useNavigate } from 'react-router-dom';

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  const bookingHandler = () => {
    navigate('/signin?redirect=/shipping');
  };
  const checkAvailability = () => {
    //navigate('/signin?redirect=/shipping');
  };
  const biddingHandler = () => {

  };
  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shpping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={5}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      <Link to={`/book/${item.slugs}`} className="link">{item.title}</Link>
                    </Col>
                    <Col md={2}>Price: ${item.price}</Col>
                    <Col md={2}>
                      <Button
                        onClick={() => removeItemHandler(item)}
                        variant="light"
                        className="link"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                    <Col md={3}>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkAvailability}
                    >
                      Check Availability
                    </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
              
                <ListGroup.Item>
                <div className="d-grid">
                  <Button
                      type="button"
                      variant="primary"
                      onClick={biddingHandler}
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Bidding
                  </Button>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={bookingHandler}
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Booking
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
