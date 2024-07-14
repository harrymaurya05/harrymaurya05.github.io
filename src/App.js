import React, { useState, useEffect } from 'react';
import './App.css';

const NEWS_API_KEY = "435a65da0d7545a2954e515446836925";
const newsUrl = "https://newsapi.org/v2/everything?q=";
const zomatoUrl = "https://blog.zomato.com/api/fetch";
const ZOMATO_API_KEY = "4e754626-be95-11ed-a9d6-15f5bdc28dc";

function App() {
  const [articles, setArticles] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("India");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchNews(currentCategory);
  }, [currentCategory]);

  const fetchNews = async (query) => {
    try {
      const res = await fetch(`${newsUrl}${query}&apiKey=${NEWS_API_KEY}`);
      const data = await res.json();
      setArticles(data.articles);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const fetchZomatoBlog = async () => {
    try {
      const res = await fetch(zomatoUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ZOMATO_API_KEY,
        },
        body: JSON.stringify({
          variables: { endCursor: "", categoryIds: [759775375], count: 4 },
          query: `query ($categoryIds: [ID], $endCursor: String = "", $count: Int) {
            posts(first: $count, after: $endCursor, where: { categoryIn: $categoryIds }) {
              nodes {
                date
                excerpt
                title
                slug
                id
                author {
                  node {
                    name
                    __typename
                  }
                  __typename
                }
                categories {
                  nodes {
                    name
                    databaseId
                    uri
                    slug
                    __typename
                  }
                  __typename
                }
                featuredImage {
                  node {
                    altText
                    mediaItemUrl
                    __typename
                  }
                  __typename
                }
                uri
                __typename
              }
              pageInfo {
                hasNextPage
                endCursor
                __typename
              }
              __typename
            }
          }`,
        }),
      });
      const data = await res.json();
      const zomatoArticles = data.data.posts.nodes.map((post) => ({
        title: post.title,
        description: post.excerpt,
        url: `https://blog.zomato.com${post.uri}`,
        urlToImage: post.featuredImage?.node?.mediaItemUrl || "https://via.placeholder.com/400x200",
        source: { name: "Zomato Blog" },
        publishedAt: post.date,
      }));
      setArticles(zomatoArticles);
    } catch (error) {
      console.error("Error fetching Zomato blog posts:", error);
    }
  };

  const handleCategoryClick = (category) => {
    setCurrentCategory(category);
    if (category === "zomato") {
      fetchZomatoBlog();
    } else {
      fetchNews(category);
    }
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
          {articles.map((article, index) => (
            <div className="card" key={index} onClick={() => window.open(article.url, "_blank")}>
              <div className="card-header">
                <img src={article.urlToImage || "https://via.placeholder.com/400x200"} alt="news" />
              </div>
              <div className="card-content">
                <h3>{article.title}</h3>
                <h6 className="news-source">{`${article.source.name} · ${new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Jakarta" })}`}</h6>
                <p className="news-desc">{article.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;

function reload() {
  window.location.reload();
}
