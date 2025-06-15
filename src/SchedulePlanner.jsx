// src/SchedulePlanner.jsx
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

// —— Correct CSS imports for FullCalendar v6+ —— 


export default function SchedulePlanner() {
  return (
    <div className="calendar-container">
      <h2>My Schedule Planner</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        editable={true}
        selectable={true}
        events={[
          {
            title: 'Korean Study',
            start: '2025-06-16T06:30:00',
            end: '2025-06-16T07:30:00',
          },
          {
            title: 'Workout',
            start: '2025-06-16T17:30:00',
            end: '2025-06-16T18:30:00',
          },
        ]}
      />
    </div>
  );
}
