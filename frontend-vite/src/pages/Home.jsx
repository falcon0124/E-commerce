import { useState } from 'react';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: 'Earthen Bottle',
    price: '$48',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg',
    imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
    cateogary: 'Electronics',
  },
  {
    id: 2,
    name: 'Stylish Lamp',
    price: '$99',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-02.jpg',
    imageAlt: 'Aesthetic lamp with modern design.',
    cateogary: 'Fashion',
  },
  {
    id: 3,
    name: 'Modern Sofa',
    price: '$299',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-02.jpg',
    imageAlt: 'Comfortable modern sofa.',
    cateogary: 'Home',
  },
  {
    id: 4,
    name: 'Classic Novel',
    price: '$19',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-02.jpg',
    imageAlt: 'Vintage book cover.',
    cateogary: 'Books',
  },
  {
    id: 5,
    name: 'Multicolor Pens',
    price: '$9',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-02.jpg',
    imageAlt: 'Pack of colorful pens.',
    cateogary: 'Other',
  },
];

export default function Home() {
  const [filteredItems, setFilteredItems] = useState(products);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filterProducts = (categories, keyword) => {
    let filtered = [...products];

    if (categories.length > 0) {
      filtered = filtered.filter(item => categories.includes(item.cateogary));
    }

    if (keyword.trim() !== '') {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    let updated = [];

    if (checked) {
      updated = [...selectedCategories, value];
    } else {
      updated = selectedCategories.filter((cat) => cat !== value);
    }

    setSelectedCategories(updated);
    filterProducts(updated, searchTerm);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterProducts(selectedCategories, term);
  };

  return (
    <>
      <div className="search-bar space text-center font-bold text-gray-800 py-6 px-8 backdrop-blur-sm bg-white/50 shadow-xl rounded-3xl mx-auto max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-4 sm:text-center">
          <label htmlFor="search" className="text-lg sm:text-xl">Search Product(s):</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="e.g. Car, Lamp, Sofa..."
              className="bg-blue-200 rounded-2xl border-2 border-blue-300 px-4 py-1 w-60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button disabled className="bg-blue-400 text-white rounded-full p-2 opacity-60 cursor-not-allowed">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.2-5.2m0 0A7.5 7.5 0 1 0 5.2 5.2a7.5 7.5 0 0 0 10.6 10.6Z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="category" className="block mb-2 text-lg">Select Categories:</label>
          <div className="bg-blue-100 rounded-2xl px-4 py-3 border-2 border-blue-300 flex flex-wrap justify-center gap-4">
            {['Electronics', 'Fashion', 'Home', 'Books', 'Other'].map((cat) => (
              <label key={cat} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={cat}
                  checked={selectedCategories.includes(cat)}
                  onChange={handleCategoryChange}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="hero-banner mt-10 text-center font-bold text-gray-800 py-24 px-6 backdrop-blur-sm bg-white/40 shadow-md rounded-lg mx-4 overflow-x-auto whitespace-nowrap">
        <h1 className="text-xl sm:text-xs md:text-6xl lg:text-7xl xl:text-8xl">
          ALL YOU NEED IS HERE!!!
        </h1>
      </div>

      <div className="flex flex-wrap justify-center">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="max-w-sm space hover:border-amber-200 ease-in border-#101828 border-4 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 mb-10 ml-10"
          >
            <img
              src={item.imageSrc}
              alt={item.imageAlt}
              className="w-full h-64 object-cover border-b-4 border-amber-300 hover:border-#101828 ease-in"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
              <p className="text-gray-500">#{item.cateogary}</p>
              <p className="text-gray-500 mt-1">{item.price}</p>
              <div className="flex justify-between">
                <Link
                  to="/ProductDetails"
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Product
                </Link>
                <button className="text-xs cursor-pointer mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
