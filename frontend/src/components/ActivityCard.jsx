import "./ActivityCard.css";

function ActivityCard() {

  const activities = [
    "📄 Uploaded medical paper",
    "🤖 Asked AI to summarize paper",
    "📚 Viewed references",
    "🔍 Searched indexed papers",
  ];

  return (

    <div className="activity-card">

      <h3>Recent Activity</h3>

      <ul>

        {activities.map((item, index) => (

          <li key={index}>

            {item}

          </li>

        ))}

      </ul>

    </div>

  );

}

export default ActivityCard;