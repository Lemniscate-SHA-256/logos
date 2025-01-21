import { FRAMEWORKS } from "../frameworks";

 // src/components/FrameworkLibrary.jsx
 const FrameworkLibrary = ({ onApplyFramework }) => {
    return (
      <div className="framework-sidebar">
        <h3>Thinking Frameworks</h3>
        {Object.entries(FRAMEWORKS).map(([name, config]) => (
          <div key={name} className="framework-card">
            <h4>{name}</h4>
            <p>{config.description}</p>
            <button onClick={() => onApplyFramework(name)}>
              Apply Framework
            </button>
          </div>
        ))}
      </div>
    );
  }; export default FrameworkLibrary;           