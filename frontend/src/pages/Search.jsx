import React, { useState } from "react";
import {
  FaSearch,
  FaFileMedical,
  FaUserMd,
  FaCalendarAlt,
  FaBookMedical,
} from "react-icons/fa";
import "../styles/Search.css";

const papers = [
  {
    id: 1,
    title: "Diabetes Mellitus: Current Research",
    journal: "The Lancet",
    year: "2025",
    author: "Dr. Smith",
    description:
      "Comprehensive review of diabetes treatment and diagnosis.",
  },
  {
    id: 2,
    title: "COVID-19 Vaccine Clinical Study",
    journal: "Nature Medicine",
    year: "2024",
    author: "Dr. Williams",
    description:
      "Evaluation of vaccine effectiveness across multiple age groups.",
  },
  {
    id: 3,
    title: "Cancer Immunotherapy Advances",
    journal: "JAMA",
    year: "2025",
    author: "Dr. Johnson",
    description:
      "Latest developments in immunotherapy treatment strategies.",
  },
];

function Search() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const recentSearches = [
    "Diabetes",
    "COVID-19",
    "Cancer",
    "Hypertension",
  ];

  const handleSearch = () => {
    setLoading(true);

    setTimeout(() => {
      const filtered = papers.filter(
        (paper) =>
          paper.title.toLowerCase().includes(search.toLowerCase()) ||
          paper.description.toLowerCase().includes(search.toLowerCase())
      );

      setResults(filtered);
      setLoading(false);
    }, 1000);
  };

  const handleRecentSearch = (term) => {
    setSearch(term);

    const filtered = papers.filter(
      (paper) =>
        paper.title.toLowerCase().includes(term.toLowerCase()) ||
        paper.description.toLowerCase().includes(term.toLowerCase())
    );

    setResults(filtered);
  };

  return (
    <div className="search-page">

      <div className="search-header">
        <h1>Search Medical Research Papers</h1>
        <p>
          Find research papers using keywords, topics, authors or journals.
        </p>
      </div>

      <div className="search-bar">

        <input
          type="text"
          placeholder="Search papers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={handleSearch}>
          <FaSearch />
          Search
        </button>

      </div>

      <div className="filters">

        <div className="filter-card">Publication Year</div>

        <div className="filter-card">Study Type</div>

        <div className="filter-card">Journal</div>

        <div className="filter-card">Author</div>

        <div className="filter-card">Sort By</div>

      </div>

      <div className="recent">

        <h3>Recent Searches</h3>

        <div className="recent-list">

          {recentSearches.map((item) => (
            <button
              key={item}
              onClick={() => handleRecentSearch(item)}
            >
              {item}
            </button>
          ))}

        </div>

      </div>

      {loading && (
        <div className="loading">

          <div className="skeleton"></div>
          <div className="skeleton"></div>
          <div className="skeleton"></div>

        </div>
      )}

      {!loading && results.length === 0 && search !== "" && (
        <div className="empty">

          <FaSearch size={45} />

          <h2>No matching papers found.</h2>

          <p>Try another keyword.</p>

        </div>
      )}

      {!loading && results.length === 0 && search === "" && (
        <div className="empty">

          <FaFileMedical size={45} />

          <h2>Search for Research Papers</h2>

          <p>Use keywords to search medical papers.</p>

        </div>
      )}

      <div className="results">

        {results.map((paper) => (

          <div className="paper-card" key={paper.id}>

            <h2>{paper.title}</h2>

            <p>
              <FaBookMedical />
              {paper.journal}
            </p>

            <p>
              <FaCalendarAlt />
              {paper.year}
            </p>

            <p>
              <FaUserMd />
              {paper.author}
            </p>

            <p>{paper.description}</p>

            <button>View Details</button>

          </div>

        ))}

      </div>

      {results.length > 0 && (

        <div className="pagination">

          <button>Previous</button>

          <button className="active">1</button>

          <button>2</button>

          <button>3</button>

          <button>Next</button>

        </div>

      )}

    </div>
  );
}

export default Search;