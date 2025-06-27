import React from 'react'
import Calendar from './calendar/calendar'
import AnnouncementManager from './table/table';
function Announcement() {
  return (
    <div>
      {/* calendar */}
      <div className='calendar'>
        <Calendar></Calendar>
      </div>
      <div className="table">
        <AnnouncementManager />
      </div>
    </div>
  )
}

export default Announcement;