function CardTamplate({isLoading,error,articles}){
    //const {isLoading,error,article} =  props;
    return (
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
                    {article.author && article.author.trim() !== "" && (
                      <p className="blog-author">{article.author}</p>
                    )}                      
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
    );
}
export default CardTamplate;