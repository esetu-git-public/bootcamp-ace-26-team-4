import { useState } from "react";
import {
  FaSearch,
  FaFileMedical,
  FaCalendarAlt,
  FaTrash,
  FaEye,
} from "react-icons/fa";

import "../styles/Search.css";

function Search() {

  const [search,setSearch]=useState("");

  const papers=[

    {
      id:1,
      title:"Heart Disease Prediction using Machine Learning",
      date:"10 July 2026",
      size:"2.4 MB"
    },

    {
      id:2,
      title:"Cancer Detection Research",
      date:"09 July 2026",
      size:"4.2 MB"
    },

    {
      id:3,
      title:"COVID Clinical Guidelines",
      date:"08 July 2026",
      size:"1.9 MB"
    }

  ];

  const filtered=papers.filter((paper)=>

    paper.title.toLowerCase().includes(search.toLowerCase())

  );

  return (

<div className="search-page">

<h1>📄 Research Papers</h1>

<p>
Manage and search uploaded research papers.
</p>

<div className="search-box">

<FaSearch/>

<input

placeholder="Search papers..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>

</div>

<div className="paper-grid">

{

filtered.length===0 ?

(

<div className="empty">

No documents found.

</div>

)

:

filtered.map((paper)=>(

<div

className="paper-card"

key={paper.id}

>

<div className="paper-top">

<FaFileMedical className="paper-icon"/>

<h3>{paper.title}</h3>

</div>

<div className="paper-info">

<p>

<FaCalendarAlt/>

{paper.date}

</p>

<p>

{paper.size}

</p>

</div>

<div className="paper-buttons">

<button>

<FaEye/>

View

</button>

<button className="delete">

<FaTrash/>

Delete

</button>

</div>

</div>

))

}

</div>

</div>

);

}

export default Search;