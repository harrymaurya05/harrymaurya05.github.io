import React, { useState, useEffect } from 'react';
import './App.css';

const newsUrl = "http://3.231.236.198:5000/api/zomoto";

function App() {
  const [articles, setArticles] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("India");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchNews(currentCategory);
  }, [currentCategory]);

  const fetchNews = async (query) => {
    try {
      const res = await fetch(newsUrl, {
        credentials: 'include' // Include credentials in the request
      });
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      console.log("Response data:", data); // Log the response data
      setArticles(data.articles || []); // Set articles or empty array if undefined
    } catch (error) {
      console.error("Error fetching news:", error);
      setArticles([]); // Set to empty array in case of error
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
                className={`hover-link nav-item ${currentCategory === "tech" && "active"}`}
                onClick={() => handleCategoryClick("tech")}
              >
                Tech
              </li>
              <li
                className={`hover-link nav-item ${currentCategory === "finance" && "active"}`}
                onClick={() => handleCategoryClick("finance")}
              >
                Finance
              </li>
              <li
                className={`hover-link nav-item ${currentCategory === "politics" && "active"}`}
                onClick={() => handleCategoryClick("politics")}
              >
                Politics
              </li>
              <li
                className={`hover-link nav-item ${currentCategory === "zomato" && "active"}`}
                onClick={() => handleCategoryClick("zomato")}
              >
                Zomato Blog
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
          {articles && articles.length > 0 ? (
            articles.map((article, index) => (
              <div className="card" key={index} onClick={() => window.open(article.page_url, "_blank")}>
                <div className="card-header">
                  <img src={article.image_url || "https://via.placeholder.com/400x200"} alt="news" />
                </div>
                <div className="card-content">
                  <h3>{article.short_title}</h3>
                  <p className="news-desc">{article.long_title}</p>
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
