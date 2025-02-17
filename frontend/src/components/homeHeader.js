import React, { useState, useEffect } from "react";

export default function HomeHeader({ isSidebar, isShowModal }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://bulletin-xi93.onrender.com/user/search/?search=${encodeURIComponent(
            searchQuery
          )}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }

        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        setError('Error fetching search results');
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="p-5 sm:px-20 flex items-center justify-between w-screen fixed top-0 bg-black z-50">
      <div className="cursor-pointer" onClick={scrollToTop}>
        <img src="/images/logo.png" alt="Logo" className="w-28" />
      </div>
      
      <div className="relative flex-1 mx-8">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />
        
        {isSearchFocused && searchQuery && (
          <div className="absolute w-full mt-2 bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-2 text-gray-400">Loading...</div>
            ) : error ? (
              <div className="px-4 py-2 text-red-400">{error}</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((result) => (
                <div
                  key={result._id}
                  className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={result.profilePicture || "/images/default-avatar.png"} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="font-semibold">{result.username}</div>
                      <div className="text-sm text-gray-400">{result.email}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-400">No results found</div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={isShowModal}
          className="px-6 py-2 bg-yellow-300 text-black rounded-full font-semibold hover:bg-yellow-400 transition duration-200"
        >
          Post Something
        </button>
        <img
          src="/images/adam.png"
          className="w-14 cursor-pointer"
          alt="User Avatar"
          onClick={isSidebar}
        />
      </div>
    </nav>
  );
}