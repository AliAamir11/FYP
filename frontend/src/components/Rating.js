function Rating(props) {
  const { caption, rating, numReviews } = props;
  return (
    <div className="rating">
      <span>
        <i
          className={
            rating === 1
              ? "fas-fa-star"
              : "far fa-star"
          }
        />
      </span>
      <span>
        <i
          className={
            rating === 2
              ? "fas-fa-star"
              : "far fa-star"
          }
        />
      </span>
      <span>
        <i
          className={
            rating === 3
              ? "fas-fa-star"
              : "far fa-star"
          }
        />
      </span>
      <span>
        <i
          className={
            rating === 4
              ? "fas-fa-star"
              : "far fa-star"
          }
        />
      </span>
      <span>
        <i
          className={
            rating === 5
              ? "fas-fa-star"
              : "far fa-star"
          }
        />
      </span>
      {caption ? (
        <span>{caption}</span>
      ) : (
        <span>{" " + numReviews + " reviews"}</span>
      )}
    </div>
  );
}
export default Rating;
