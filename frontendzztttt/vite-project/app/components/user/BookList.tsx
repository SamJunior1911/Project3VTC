import React from "react";

interface Book {
  id: number;
  title: string;
  author: string;
  price: string;
  img: string;
}

const books: Book[] = [
  {
    id: 1,
    title: "Sách 1",
    author: "Tác giả 1",
    price: "120.000đ",
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  },
  {
    id: 2,
    title: "Sách 2",
    author: "Tác giả 2",
    price: "150.000đ",
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  },
  {
    id: 3,
    title: "Sách 3",
    author: "Tác giả 3",
    price: "100.000đ",
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  },
  {
    id: 4,
    title: "Sách 4",
    author: "Tác giả 4",
    price: "200.000đ",
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  },
];

const BookList: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6">Sách nổi bật</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img
              src={book.img}
              alt={book.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{book.title}</h3>
              <p className="text-gray-500 text-sm">{book.author}</p>
              <p className="text-orange-500 font-bold mt-2">{book.price}</p>
              <button className="mt-3 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600">
                Thêm vào giỏ
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BookList;
