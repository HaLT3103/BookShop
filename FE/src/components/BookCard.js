import '../styles/BookCard.css';

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <img src={book.image} alt={book.title} className="book-image" />
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">{book.author}</p>
      <p className="book-price">${book.price}</p>
      <div className="book-actions">
        <button className="book-button">Xem chi tiết</button>
        <button className="book-button">Thêm vào giỏ hàng</button>
      </div>
    </div>
  );
};

export default BookCard;