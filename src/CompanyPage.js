// CompanyPage.js

import React from 'react';

const CompanyPage = () => {
    // Define an array of company URLs
    const companyUrls = [
        "https://blog.gojek.io/tag/tech/",
        "https://blog.zomato.com/category/technology",
        "https://zerodha.tech/",
        "https://www.linkedin.com/blog/engineering",
        "https://paytm.com/blog/engineering/",
        "https://tech.unacademy.com/",
        "https://www.uber.com/en-IN/blog/engineering/",
        "https://www.gupshup.io/resources/blog",
        "https://netflixtechblog.com",
"https://medium.com/pinterest-engineering",
"https://engineering.cred.club",
"https://engineering.razorpay.com",
"https://medium.com/1mgofficial",
"https://medium.com/@TechAtOla",
"https://tech.groww.in",
"https://medium.com/cars24",
    ];

    // Function to open the selected company URL in an iframe
    const openCompanyWebsite = (url) => {
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.width = '100%';
        iframe.style.height = '100vh';
        iframe.style.border = 'none';
        document.getElementById('iframe-container').innerHTML = '';
        document.getElementById('iframe-container').appendChild(iframe);
    };

    return (
        <div>
            <header>
                <h1>Company Websites</h1>
                <nav>
                    <ul>
                        {companyUrls.map((url, index) => (
                            <li key={index}>
                                <button onClick={() => openCompanyWebsite(url)}>
                                    {new URL(url).hostname}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>
            <main id="iframe-container">
                {/* This is where the iframe will be dynamically added */}
            </main>
        </div>
    );
};

export default CompanyPage;
