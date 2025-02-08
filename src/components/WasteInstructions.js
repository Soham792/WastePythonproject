import React from 'react';
import { GiRecycle } from 'react-icons/gi';
import { BiTime } from 'react-icons/bi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { MdReplayCircleFilled, MdCompost } from 'react-icons/md';
import './WasteInstructions.css';

const WasteInstructions = ({ instructions }) => {
  return (
    <div className="waste-instructions">
      <h3>Eco Guide <span className="eco-badge">♻</span></h3>
      
      <div className="instruction-grid">
        <div className="instruction-card recyclable">
          <GiRecycle className="icon" />
          <div>
            <h4>Recyclable</h4>
            <p>{instructions.recyclable}</p>
          </div>
        </div>

        <div className="instruction-card compostable">
          <MdCompost className="icon" />
          <div>
            <h4>Compostable</h4>
            <p>{instructions.compostable}</p>
          </div>
        </div>

        <div className="instruction-card decomposition">
          <BiTime className="icon" />
          <div>
            <h4>Decomposition Time</h4>
            <p>{instructions.decomposition_time}</p>
          </div>
        </div>

        <div className="instruction-card disposal">
          <RiDeleteBinLine className="icon" />
          <div>
            <h4>Proper Disposal</h4>
            <ul>
              {instructions.disposal_methods.map((method, idx) => (
                <li key={idx}>{method}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="instruction-card reuse">
          <MdReplayCircleFilled className="icon" />
          <div>
            <h4>Reuse Ideas</h4>
            <ul>
              {instructions.reuse_ideas.map((idea, idx) => (
                <li key={idx}>{idea}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteInstructions;