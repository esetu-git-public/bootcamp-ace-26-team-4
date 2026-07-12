import { FaSearch } from "react-icons/fa";

import "../styles/Search.css";

function Search(){

return(

<div className="search-page fade-up">

<h1>

Search Research Papers

</h1>

<div className="search-box">

<FaSearch/>

<input

placeholder="Search medical research papers..."

>

</input>

</div>

<div className="empty-search">

📄

<h2>

No Results

</h2>

<p>

Search papers by title, keywords or topics.

</p>

</div>

</div>

);

}

export default Search;