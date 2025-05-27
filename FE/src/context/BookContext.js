import React, { createContext, useState, useEffect } from "react";

export const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("https://openlibrary.org/subjects/fiction.json?limit=30")
      .then((response) => response.json())
      .then((data) => {
        const bookList = data.works.map((book) => ({
          id: book.key,
          title: book.title,
          author: book.authors ? book.authors[0].name : "Unknown",
          cover: book.cover_id
            ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
            : "https://via.placeholder.com/150",
          price: (Math.random() * (30 - 5) + 5).toFixed(2), // Random price between $5 and $30
        }));
        setBooks(bookList);
      });
  }, []);

  return (
    <BookContext.Provider value={{ books }}>
      {children}
    </BookContext.Provider>
  );
};