// client/src/components/CalendarView.tsx
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useUserContext } from '../hooks/useUserContext';
import { useAssignmentsContext } from '../hooks/useAssignmentsContext';
import { AssignmentOptions, Assignment } from '../context/AssignmentContext';
import { api } from '../constants';
import { EventInput } from '@fullcalendar/core';

export default function CalendarView() {
  const { userState } = useUserContext();
  const { assignmentsState, dispatch } = useAssignmentsContext();
  // Priority filter state
  const [filterPriorities, setFilterPriorities] = useState<string[]>(['none','low','medium','high']);

  useEffect(() => {
    // Wait until we have a logged‑in user
    if (!userState.user?.token) {
      console.warn('No authenticated user; skipping assignments fetch.');
      return;
    }

    const fetchAssignments = async () => {
      try {
        const response = await fetch(`${api}/assignments`, {
          headers: {
            Authorization: `Bearer ${userState.user.token}`,
          },
        });
        const data: Assignment[] = await response.json();

        if (response.ok) {
          dispatch({
            type: AssignmentOptions.SET_ASSIGNMENTS,
            payload: data,
          });
        } else {
          console.error('Failed to fetch assignments:', data);
        }
      } catch (err) {
        console.error('Error fetching assignments:', err);
      }
    };

    fetchAssignments();
  }, [userState.user, dispatch]);

  const priorityColors: Record<string,string> = {
    high: 'red',
    medium: 'orange',
    low: 'green',
    none: 'blue'
  };
  const events: EventInput[] = assignmentsState.assignments
    .filter(a => filterPriorities.includes(a.priority))
    .map(a => ({
      title: a.title.toString(),
      start: a.dueDate as unknown as string,
      allDay: true,
      backgroundColor: priorityColors[a.priority] || 'gray'
    }));

  
  const togglePriority = (priority: string) => {
    setFilterPriorities(prev =>
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  return (
    <div className="calendar-container">
      <div className="mb-4 space-x-4">
        {['high','medium','low','none'].map(pri => (
          <label key={pri} className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={filterPriorities.includes(pri)}
              onChange={() => togglePriority(pri)}
            />
            <span className="ml-2 capitalize">{pri}</span>
          </label>
        ))}
      </div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
      />
    </div>
  );
}