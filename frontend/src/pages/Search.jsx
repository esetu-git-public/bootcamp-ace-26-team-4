import { useState } from "react";
import "../styles/Search.css";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="search-container">

      <div className="search-header">
        <h1>Search Medical Research</h1>

        <p>
          Search uploaded research papers using keywords, diseases,
          treatments, or clinical topics.
        </p>
      </div>

      <div className="search-box">

        <input
          type="text"
          placeholder="Search research papers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button>Search</button>

      </div>

      <div className="recent-searches">

        <h2>Suggested Topics</h2>

        <div className="topic-list">
          <span>Diabetes</span>
          <span>Heart Disease</span>
          <span>Cancer</span>
          <span>COVID-19</span>
          <span>Hypertension</span>
          <span>Mental Health</span>
        </div>

      </div>

      <div className="results-section">

        <h2>Search Results</h2>

        <div className="result-card">

          <h3>No Results Found</h3>

          <p>
            Search results will appear here once research papers are uploaded.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Search;