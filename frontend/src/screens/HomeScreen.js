import { useEffect, useReducer } from "react";
import axios from "axios";
import logger from "use-reducer-logger";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Book from "../components/Book";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, books: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, books }, dispatch] = useReducer(logger(reducer), {
    books: [],
    loading: true,
    error: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/books");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }

      //setBooks(result.data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <Helmet>
        <title>Event Organization System</title>
      </Helmet>
      <h1>Featured Venues</h1>
      <div className="books">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div className="veneueCard">
            <Row>
              {books.map((book) => (
                <Col key={book.slugs} sm={6} md={4} lg={3} className="mb-3">
                  <Book book={book}></Book>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </div>
  );
}
export default HomeScreen;
