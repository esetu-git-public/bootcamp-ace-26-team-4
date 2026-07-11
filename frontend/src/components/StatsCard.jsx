import "./StatsCard.css";

function StatsCard({ icon, title, value, subtitle }) {
  return (
    <div className="stats-card">

      <div className="stats-icon">
        {icon}
      </div>

      <div className="stats-content">

        <h4>{title}</h4>

        <h2>{value}</h2>

        <p>{subtitle}</p>

      </div>

    </div>
  );
}

export default StatsCard;