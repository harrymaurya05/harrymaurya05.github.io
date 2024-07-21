import React, { useState, useEffect } from 'react';
import './App.css';

const dummyArticles = [
  // Dummy data as before
];

function App() {
  const [articles, setArticles] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("zomato");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cachedArticles = localStorage.getItem('articles');
    const cachedCategory = localStorage.getItem('currentCategory');

    if (cachedArticles && cachedCategory === currentCategory) {
      console.log("data already present!!");
      setArticles(JSON.parse(cachedArticles));
      setIsLoading(false);
    } else {
      fetchNews(currentCategory);
    }
  }, [currentCategory]);

  const fetchNews = async (query) => {
    const baseUrl = "http://127.0.0.1:8080/api/articles";
    const newsUrl = `${baseUrl}?company=${query || currentCategory}`;

    try {
      const res = await fetch(newsUrl, {
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      console.log("Response data:", data);

      if (Array.isArray(data.articles)) {
        if (data.articles.length === 0) {
          setArticles(dummyArticles);
          localStorage.setItem('articles', JSON.stringify(dummyArticles)); // Cache dummy data
        } else {
          setArticles(data.articles);
          localStorage.setItem('articles', JSON.stringify(data.articles)); // Cache actual data
        }
      } else {
        setArticles(dummyArticles);
        localStorage.setItem('articles', JSON.stringify(dummyArticles)); // Cache dummy data
      }
      localStorage.setItem('currentCategory', currentCategory); // Cache current category
    } catch (error) {
      console.error("Error fetching news:", error);
      setArticles(dummyArticles);
      localStorage.setItem('articles', JSON.stringify(dummyArticles)); // Cache dummy data
      setError("Failed to load data. Displaying dummy content.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setCurrentCategory(category);
    fetchNews(category);
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      fetchNews(searchQuery);
      setCurrentCategory(null);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="App">
      <nav>
        <div className="main-nav container flex">
          <a href="#" onClick={reload} className="company-logo">
            <img src="assets/uniBlog_logo.png" alt="company logo" />
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
              <li className="space"></li>
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
              placeholder="Search"
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
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : (
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
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
      </footer>

      <button className="back-to-top-floating" onClick={scrollToTop}>
        ↑
      </button>
    </div>
  );
}

export default App;

function reload() {
  window.location.reload();
}
