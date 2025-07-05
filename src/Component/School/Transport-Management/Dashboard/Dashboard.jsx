import React from 'react'
import Card from './card/card'
import Date from '../Date/date';
import DriverAttendance from '../DriverChart/DriverAttendance';
import  DManagement from '../Dashboard/BusManagement/BusManagement';
import './Dashboard.css'
function TDashboard() {
    return (
        <div>
            <div className="flex flex-wrap -mx-4 ">
                <div className="w-full lg:w-8/12 px-4 gap-2 pr-6 mb-6 lg:mb-0">
                    <div>
                        <Card />
                    </div>
                    <div>
                        
                        <DriverAttendance />
                    </div>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                    <Date></Date>
                </div>
            </div>
<div>
    <DManagement/>
</div>

        </div>
    )
}

export default TDashboard;