import {

FaUserCircle,
FaEnvelope,
FaLaptopCode,
FaGithub,

} from "react-icons/fa";

import "../styles/Profile.css";

function Profile(){

return(

<div className="profile-page">

<div className="profile-card">

<FaUserCircle className="profile-icon"/>

<h2>

Sreeja

</h2>

<p>

Frontend Developer

</p>

<div className="profile-info">

<div>

<FaEnvelope/>

student@example.com

</div>

<div>

<FaLaptopCode/>

React Developer

</div>

<div>

<FaGithub/>

Medical AI Assistant Team

</div>

</div>

</div>

</div>

);

}

export default Profile;