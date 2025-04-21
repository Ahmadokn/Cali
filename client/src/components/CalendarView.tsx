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
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
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
      start: `${(a.dueDate as unknown as string).slice(0,10)}T${a.dueTime}`,
      allDay: false,
      backgroundColor: priorityColors[a.priority] || 'gray',
      extendedProps: { assignment: a }
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
        eventClick={(info) => {
          setSelectedAssignment(info.event.extendedProps.assignment);
        }}
      />
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">{selectedAssignment.title}</h2>
            <p><strong>Course:</strong> {selectedAssignment.course}</p>
            <p>
              <strong>Due:</strong> {new Date(selectedAssignment.dueDate).toISOString().slice(0,10)} at {selectedAssignment.dueTime}
            </p>
            <p><strong>Priority:</strong> {selectedAssignment.priority}</p>
            <p><strong>Status:</strong> {selectedAssignment.status}</p>
            {selectedAssignment.description && (<p><strong>Description:</strong> {selectedAssignment.description}</p>)}
            {selectedAssignment.tags.length > 0 && (<p><strong>Tags:</strong> {selectedAssignment.tags.join(', ')}</p>)}
            {selectedAssignment.reminder.enabled && (<p><strong>Reminder:</strong> {selectedAssignment.reminder.offsetMinutes} min before</p>)}
            {selectedAssignment.recurrence.frequency !== 'none' && (
              <p><strong>Recurrence:</strong> {selectedAssignment.recurrence.frequency} every {selectedAssignment.recurrence.interval}</p>
            )}
            <button
              onClick={() => setSelectedAssignment(null)}
              className="mt-4 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}