import "./StatusCard.css";

function StatusCard() {

  const status = [
    { name: "Backend", value: "Online" },
    { name: "Gemini AI", value: "Connected" },
    { name: "Vector DB", value: "Ready" },
    { name: "Retriever", value: "Working" },
  ];

  return (

    <div className="status-card">

      <h3>System Status</h3>

      {status.map((item, index) => (

        <div
          key={index}
          className="status-row"
        >

          <span>{item.name}</span>

          <span className="status-online">

            ● {item.value}

          </span>

        </div>

      ))}

    </div>

  );

}

export default StatusCard;