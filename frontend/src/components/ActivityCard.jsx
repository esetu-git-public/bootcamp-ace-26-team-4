import {
  FaClock,
  FaFileMedical,
  FaRobot,
} from "react-icons/fa";

function ActivityCard() {

  return (

    <div className="recent-card">

      <h2>

        Recent Activity

      </h2>

      <div className="activity-item">

        <FaFileMedical />

        <div>

          <h4>

            Research Paper Uploaded

          </h4>

          <p>

            AI indexed the document successfully.

          </p>

        </div>

      </div>

      <div className="activity-item">

        <FaRobot />

        <div>

          <h4>

            AI Ready

          </h4>

          <p>

            Ask questions using Gemini AI.

          </p>

        </div>

      </div>

      <div className="activity-item">

        <FaClock />

        <div>

          <h4>

            Session Started

          </h4>

          <p>

            Ready to analyze medical literature.

          </p>

        </div>

      </div>

    </div>

  );

}

export default ActivityCard;