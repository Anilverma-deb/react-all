
import React, { useState } from 'react';
import SessionCards from './SessionCards/SessionCards';
import SessionManagement from './AddEdit/Add';
import './SessionDashboard.css';

function SessionDashboard() {
  

    return (
  <div>
            <SessionCards/>
                <SessionManagement/>
        </div>
    );
}

export default SessionDashboard;
