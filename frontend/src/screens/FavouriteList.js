import { useContext } from "react";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import MessageBox from "../components/MessageBox";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    favourites: { favouritesItems },
  } = state;

  const removeItemHandler = (item) => {
    ctxDispatch({ type: "FAVOURITES_REMOVE_ITEM", payload: item });
  };
  return (
    <div>
      <Helmet>
        <title>Favourite List</title>
      </Helmet>
      <h1>Favourite List</h1>
      <Row>
        {favouritesItems.length === 0 ? (
          <MessageBox>
            Cart is empty. <Link to="/">Go Shopping</Link>
          </MessageBox>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="text-center">Image</th>
                <th className="text-center">Title</th>
                <th className="text-center">Price</th>
                <th className="text-center">Category</th>
                <th className="text-center">Author</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {favouritesItems.map((item) => (
                <tr key={item._id}>
                  <td className="text-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="img-fluid rounded img-thumbnail"
                    />
                  </td>
                  <td className="text-center">
                    <Link to={`/book/${item.slugs}`}>{item.title}</Link>
                  </td>
                  <td className="text-center">${item.price}</td>
                  <td className="text-center">{item.category}</td>
                  <td className="text-center">{item.author}</td>
                  <td className="text-center">
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeItemHandler(item)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Row>
    </div>
  );
}
