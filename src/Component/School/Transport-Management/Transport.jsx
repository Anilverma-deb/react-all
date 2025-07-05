import React from 'react'
import TDashboard from './Dashboard/Dashboard';
import BusRoutes from './Route/Route';
import DriverManagement from './Driver/Driver';
import VehicleDetails from './Bus/Bus';
import ScheduleManagement from './Schedule/Schedule';
import StudentTransportMap from './StudentMap/StudentTransport';
import TransportReport from './TransportReport/Transport';
function Transport() {
  return (
    <div>
<TDashboard/>
<BusRoutes/>
<DriverManagement/>
<VehicleDetails/>
<ScheduleManagement/>
<StudentTransportMap/>
<TransportReport/>
    </div>
  )
}

export default Transport