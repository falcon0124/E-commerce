import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { backendUrl } = useAuth();
  const [products, setProducts] = useState([])
  const [filteredItems, setFilteredItems] = useState(products);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/product/all`);
        const data = await res.json();

        console.log("✅ Products fetched:", data);

        const productArray = data.allProducts;

        setProducts(productArray);
        setFilteredItems(productArray);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [backendUrl]);

  const filterProducts = (categories, keyword) => {
    let filtered = [...products];

    if (categories.length > 0) {
      filtered = filtered.filter(item => categories.includes(item.category));
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

      <div className="flex flex-wrap justify-center px-4">
        {filteredItems?.map((item) => (
          <div
            key={item._id || item.id}
            className="w-full max-w-xs bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 m-4 border border-gray-200"
          >
            <img
              src={`${backendUrl}/${item.imageUrl}`}
              alt={item.name}
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 truncate">{item.pdtName}</h2>
              <p className="text-gray-500 text-sm mb-1">#{item.category}</p>
              <p className="text-gray-700 font-medium">{item.price}</p>

              <div className="flex justify-between items-center mt-4">
                <Link
                  to={`/product/${item._id || item.id}`}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                >
                  View
                </Link>
                <button className="text-blue-600 hover:text-blue-800 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.5 6M7 13l-1.5 6h13a1 1 0 001-1V14M10 21a1 1 0 11-2 0 1 1 0 012 0zm10 0a1 1 0 11-2 0 1 1 0 012 0z" />
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
