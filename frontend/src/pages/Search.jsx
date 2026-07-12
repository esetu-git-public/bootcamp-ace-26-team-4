import { useState } from "react";
import {
  FaSearch,
  FaFileMedical,
} from "react-icons/fa";

import "../styles/Search.css";

function Search() {
  const [search, setSearch] = useState("");

  const papers = [
    {
      title: "Diabetes Prediction using Machine Learning",
      author: "John Smith",
      year: "2024",
    },
    {
      title: "Breast Cancer Detection with Deep Learning",
      author: "Sarah Wilson",
      year: "2023",
    },
    {
      title: "COVID-19 Diagnosis using Chest X-rays",
      author: "David Brown",
      year: "2022",
    },
    {
      title: "Heart Disease Prediction using AI",
      author: "Emily Johnson",
      year: "2024",
    },
  ];

  const filtered = papers.filter((paper) =>
    paper.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="search-page fade-up">

      <div className="search-header">

        <h1>Search Medical Papers</h1>

        <p>
          Browse indexed medical research documents.
        </p>

      </div>

      <div className="search-box">

        <FaSearch />

        <input
          type="text"
          placeholder="Search research papers..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      <div className="paper-grid">

        {filtered.map((paper, index) => (

          <div
            key={index}
            className="paper-card"
          >

            <FaFileMedical />

            <h3>{paper.title}</h3>

            <p>{paper.author}</p>

            <span>{paper.year}</span>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Search;