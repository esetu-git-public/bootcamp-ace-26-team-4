import { useState } from "react";

import {
  FaSearch,
  FaFileMedical,
  FaFilter,
  FaFilePdf,
  FaDownload,
} from "react-icons/fa";

import "../styles/Search.css";

function Search() {

  const [query, setQuery] = useState("");

  const papers = [
    {
      id: 1,
      title: "Deep Learning for Medical Diagnosis",
      type: "PDF",
      year: "2025",
      author: "John Smith",
    },
    {
      id: 2,
      title: "Cancer Detection using AI",
      type: "PDF",
      year: "2024",
      author: "Emily Brown",
    },
    {
      id: 3,
      title: "Clinical NLP Research",
      type: "PDF",
      year: "2023",
      author: "David Lee",
    },
  ];

  const filtered = papers.filter((paper) =>
    paper.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-page">

      <div className="search-header">

        <div>

          <h1>🔍 Search Medical Papers</h1>

          <p>
            Browse indexed research papers and documents.
          </p>

        </div>

      </div>

      <div className="search-toolbar">

        <div className="search-box">

          <FaSearch />

          <input
            type="text"
            placeholder="Search papers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

        </div>

        <button className="filter-btn">

          <FaFilter />

          Filters

        </button>

      </div>

      <div className="paper-grid">

        {filtered.map((paper) => (

          <div
            key={paper.id}
            className="paper-card"
          >

            <FaFileMedical className="paper-icon" />

            <h3>{paper.title}</h3>

            <p>

              <strong>Author:</strong> {paper.author}

            </p>

            <p>

              <strong>Year:</strong> {paper.year}

            </p>

            <div className="paper-footer">

              <span>

                <FaFilePdf />

                {paper.type}

              </span>

              <button>

                <FaDownload />

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );

}

export default Search;