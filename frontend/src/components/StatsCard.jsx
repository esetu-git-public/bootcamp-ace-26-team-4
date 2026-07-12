import { useEffect, useState } from "react";

function StatsCard({
  icon,
  title,
  value,
  subtitle,
}) {
  const numeric = !isNaN(parseFloat(value));

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!numeric) return;

    let current = 0;
    const target = parseInt(value);

    const timer = setInterval(() => {
      current++;

      setCount(current);

      if (current >= target) {
        clearInterval(timer);
      }
    }, 25);

    return () => clearInterval(timer);
  }, [value, numeric]);

  return (
    <div className="stat-card">
      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-content">
        <h2>
          {numeric ? count : value}
        </h2>

        <h4>
          {title}
        </h4>

        <p>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default StatsCard;