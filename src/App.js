import React, { useState, useEffect } from 'react';
import './App.css';

const newsUrl = "http://127.0.0.1:8080/api/zomato";

function App() {
  const [articles, setArticles] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("zomato");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchNews(currentCategory);
  }, [currentCategory]);

  const fetchNews = async (query) => {
    // Define the base URL
    const baseUrl = "http://127.0.0.1:8080/api/articles";
    // Determine the endpoint based on the query parameter
    const endpoint = query ? query : "zomato";
    // Construct the full URL
    const newsUrl = `${baseUrl}`+"?company="+`${endpoint}`;

    try {
      // Make the fetch call with credentials included
      const res = await fetch(newsUrl, {
        credentials: 'include' // Include credentials in the request
      });

      // Check if the response is OK
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      // Parse the response data as JSON
      const data = await res.json();
      console.log("Response data:", data); // Log the response data

      // Ensure data.articles is an array before setting
      if (Array.isArray(data.articles)) {
        setArticles(data.articles);
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      // Set to empty array in case of error
      setArticles([]);
    }
  };

  const handleCategoryClick = (category) => {
    setCurrentCategory(category);
    fetchNews(category);
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      fetchNews(searchQuery);
      setCurrentCategory(null); // Reset current category selection
    }
  };

  return (
    <div className="App">
      <nav>
        <div className="main-nav container flex">
          <a href="#" onClick={reload} className="company-logo">
            <img src="/assets/logo.png" alt="company logo" />
          </a>
          <div className="nav-links">
            <ul className="flex">
              <li
                className={`hover-link nav-item ${currentCategory === "zomato" && "active"}`}
                onClick={() => handleCategoryClick("zomato")}
              >
                Zomato
              </li>
              <li
                className={`hover-link nav-item ${currentCategory === "paytm" && "active"}`}
                onClick={() => handleCategoryClick("paytm")}
              >
                Paytm
              </li>
              <li className="space"></li> {/* Space item for alignment */}
              <li
                className={`hover-link nav-item ${currentCategory === "phonepe" && "active"}`}
                onClick={() => handleCategoryClick("phonepe")}
              >
                PhonePe
              </li>
            </ul>

          </div>

          <div className="search-bar flex">
            <input
              id="search-text"
              type="text"
              className="news-input"
              placeholder="e.g. Science"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button id="search-button" className="search-button" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </nav>

      <main>
        <div className="cards-container container flex">
          {Array.isArray(articles) && articles.length > 0 ? (
            articles.map((article, index) => (
              <div className="card" key={index} onClick={() => window.open(article.page_url, "_blank")}>
                <div className="card-header">
                  <img src={article.image_url || "https://via.placeholder.com/400x200"} alt="news" />
                </div>
                <div className="card-content">
                  <div className="blog-meta">
                    <p className="blog-author">{article.author}</p>
                    <p className="blog-date">{article.blog_date}</p>
                    <p className="blog-read-time">{article.blog_read_time}</p>
                  </div>
                  <h3>{article.short_title}</h3>
                  <p className="news-desc">
                    {article.long_title && article.long_title.length > 100
                      ? `${article.long_title.substring(0, 100)}... read more`
                      : article.long_title || null}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No articles available</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

function reload() {
  window.location.reload();
}
