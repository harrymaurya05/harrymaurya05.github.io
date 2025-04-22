import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CardTamplate from "./components/CardTamplate";
import "./App.css";
const dummyArticles = [
  {
    image_url: "https://via.placeholder.com/400x200",
    author: "John Doe",
    blog_date: "2024-07-21",
    blog_read_time: "5 min read",
    short_title: "Dummy Title 1",
    long_title:
      "This is a longer description for the dummy article 1. It provides additional context and details.",
    page_url: "#",
  },
  {
    image_url: "https://via.placeholder.com/400x200",
    author: "Jane Smith",
    blog_date: "2024-07-20",
    blog_read_time: "4 min read",
    short_title: "Dummy Title 2",
    long_title:
      "This is a longer description for the dummy article 2. It provides additional context and details.",
    page_url: "#",
  },
  {
    image_url: "https://via.placeholder.com/400x200",
    author: "Alice Johnson",
    blog_date: "2024-07-19",
    blog_read_time: "6 min read",
    short_title: "Dummy Title 3",
    long_title:
      "This is a longer description for the dummy article 3. It provides additional context and details.",
    page_url: "#",
  },
  {
    image_url: "https://via.placeholder.com/400x200",
    author: "Bob Brown",
    blog_date: "2024-07-18",
    blog_read_time: "3 min read",
    short_title: "Dummy Title 4",
    long_title:
      "This is a longer description for the dummy article 4. It provides additional context and details.",
    page_url: "#",
  },
  {
    image_url: "https://via.placeholder.com/400x200",
    author: "Charlie Davis",
    blog_date: "2024-07-17",
    blog_read_time: "7 min read",
    short_title: "Dummy Title 5",
    long_title:
      "This is a longer description for the dummy article 5. It provides additional context and details.",
    page_url: "#",
  },
  {
    image_url: "https://via.placeholder.com/400x200",
    author: "Dana Evans",
    blog_date: "2024-07-16",
    blog_read_time: "5 min read",
    short_title: "Dummy Title 6",
    long_title:
      "This is a longer description for the dummy article 6. It provides additional context and details.",
    page_url: "#",
  },
];
function App() {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [currentCategory, setCurrentCategory] = useState("zomato");
  const [selectedCompnay, setSelectedCompnay] = useState(currentCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  //const base_ip = "3.231.236.198";
  const base_ip = "127.0.0.1";
  //const port = "8081";
  const port = "8090";
  const companyListDummy = [
    { name: "zomato" },
    { name: "paytm" },
    { name: "phonepe" },
  ];
  useEffect(() => {
    const cachedArticles = localStorage.getItem("articles");
    const cachedCategory = localStorage.getItem("currentCategory");
    // if (cachedArticles && cachedCategory === currentCategory) {
    //   setArticles(JSON.parse(cachedArticles));
    //   setIsLoading(false);
    // } else {
    //   fetchNews(currentCategory);
    // }
    fetchNews(currentCategory);
  }, [currentCategory]);
  useEffect(() => {
    fetchCompanies();
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setCurrentPage((prevPage) => prevPage + 1); // Load next page
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const fetchCompanies = async () => {
    //const baseUrl = `https://uniblog.click/api/companies`;
    const baseUrl = `http://localhost:8090/api/companies`;
    try {
      const res = await fetch(baseUrl, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setCompanyList(data.companies || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setCompanyList(companyListDummy);
    }
  };
  const fetchNews = async (query) => {
    //const baseUrl = `https://uniblog.click/api/articles`;
    const baseUrl = `http://localhost:8090/api/articles`;
    const newsUrl = `${baseUrl}?company=${query || currentCategory}`;
    //console.log(newsUrl);
    try {
      const res = await fetch(newsUrl, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      if (Array.isArray(data.articles)) {
        if (data.articles.length === 0) {
          setArticles(dummyArticles);
          localStorage.setItem("articles", JSON.stringify(dummyArticles)); // Cache dummy data
        } else {
          setArticles(data.articles);
          localStorage.setItem("articles", JSON.stringify(data.articles)); // Cache actual data
        }
      } else {
        setArticles(dummyArticles);
        localStorage.setItem("articles", JSON.stringify(dummyArticles)); // Cache dummy data
      }
      localStorage.setItem("currentCategory", currentCategory); // Cache current category
    } catch (error) {
      console.error("Error fetching news:", error);
      setArticles(dummyArticles);
      localStorage.setItem("articles", JSON.stringify(dummyArticles)); // Cache dummy data
    } finally {
      setIsLoading(false);
    }
  };
  const handleSearch = (selectedCompany) => {
    setSearchQuery(selectedCompany);
    fetchNews(selectedCompany);
    setCurrentCategory(null);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSearchSubmit = () => {
    setSelectedCompnay(searchQuery);
    handleSearch(searchQuery);
    handleClose();
  };
  return (
    <>
      <Helmet>
        <title>UniBlog - One Place Learning</title>
        <meta
          name="description"
          content="Learn about tech blogs, news, and updates."
        />
        <meta name="keywords" content="Tech blogs, learning, news" />
      </Helmet>

      <div className="App">
        <nav className="w-full bg-white shadow-sm border-b">
          <div className="main-nav container mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo + Company Name */}
            <div className="flex items-center gap-4">
              <a href="#" onClick={reload} className="company-logo">
                <img
                  src="assets/uniBlog_logo.png"
                  alt="company logo"
                  className="h-10 w-10 object-contain"
                />
              </a>
              <h1 className="text-xl font-semibold text-gray-800 capitalize selected-company-name">
                {selectedCompnay.charAt(0).toUpperCase() +
                  selectedCompnay.slice(1)}
              </h1>
            </div>

            {/* Search Button */}
            <div>
              <Button
                className="company-search"
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
              >
                Search Company
              </Button>
            </div>
          </div>
        </nav>

        <CardTamplate isLoading={isLoading} error={error} articles={articles} />

        <footer className="footer">
          <div className="container footer-text">
            <p>&copy; 2024 UniBlog. All rights reserved.</p>
          </div>
        </footer>
        <button className="back-to-top-floating" onClick={scrollToTop}>
          <i className="fas fa-arrow-up"></i> {/* Font Awesome Arrow Icon */}
        </button>
        {/* Search Popup */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>
            Search Company
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              style={{ position: "absolute", right: 16, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Autocomplete
              options={companyList}
              getOptionLabel={(option) => option.name}
              onChange={(event, value) => setSearchQuery(value?.name || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="search-text"
                  type="text"
                  placeholder="Search companies"
                  fullWidth
                  autoFocus
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSearchSubmit} color="primary">
              Search
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
export default App;
function reload() {
  window.location.reload();
}
