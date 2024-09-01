import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export default Location = () => {
    
    return (
        <Popup open={isOpen} closeOnDocumentClick onClose={closeModal}>
        <div className="modal">
          <button className="close" onClick={closeModal}>
            &times;
          </button>
          <div className="header"> File Uploaded </div>
          <div className="content">
            {file && (
              <>
                <p>File Name: {file.name}</p>
                <p>File Size: {(file.size / 1024).toFixed(2)} KB</p>
              </>
            )}
          </div>
        </div>
      </Popup>
    );
}
