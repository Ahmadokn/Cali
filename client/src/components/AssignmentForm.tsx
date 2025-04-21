import React, { useState } from "react";
import { useAssignmentsContext } from "../hooks/useAssignmentsContext";
import { AssignmentOptions } from "../context/AssignmentContext";
import { useUserContext } from "../hooks/useUserContext";
import { api } from "../constants";

const AssignmentForm = () => {
  const { dispatch } = useAssignmentsContext();
  const { userState } = useUserContext();
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<'none'|'low'|'medium'|'high'>('none');
  const [error, setError] = useState<String | null>(null);
  const [emptyFields, setEmptyFields] = useState<String[]>([]);
  const [dueTime, setDueTime] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<'pending'|'in-progress'|'completed'>('pending');
  const [tags, setTags] = useState<string>("");
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(false);
  const [reminderOffset, setReminderOffset] = useState<number>(0);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<'none'|'daily'|'weekly'|'monthly'>('none');
  const [recurrenceInterval, setRecurrenceInterval] = useState<number>(1);
  const [showOptional, setShowOptional] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userState.user) {
      setError("You must be logged in");
      return;
    }
    // Determine values for optional fields or use defaults
    const dueTimeVal = showOptional && dueTime ? dueTime : "00:00";
    const descriptionVal = showOptional ? description : "";
    const statusVal = showOptional ? status : "pending";
    const tagsVal = showOptional
      ? tags.split(",").map(t => t.trim()).filter(Boolean)
      : [];
    const reminderVal = showOptional
      ? { enabled: reminderEnabled, offsetMinutes: reminderOffset }
      : { enabled: false, offsetMinutes: 0 };
    const recurrenceVal = showOptional
      ? { frequency: recurrenceFrequency, interval: recurrenceInterval }
      : { frequency: "none", interval: 1 };

    const assignment = {
      title,
      course,
      dueDate,
      dueTime: dueTimeVal,
      priority,
      status: statusVal,
      tags: tagsVal,
      reminder: reminderVal,
      recurrence: recurrenceVal,
      description: descriptionVal
    };
    const response = await fetch(`${api}/assignments`, {
      method: "POST",
      body: JSON.stringify(assignment),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userState.user.token}`
      }
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error);
      setEmptyFields(data.emptyFields);
    } else {
      setError(null);
      setEmptyFields([]);
      setTitle("");
      setCourse("");
      setDueDate("");
      setPriority('none');
      setDueTime("");
      setDescription("");
      setStatus('pending');
      setTags("");
      setReminderEnabled(false);
      setReminderOffset(0);
      setRecurrenceFrequency('none');
      setRecurrenceInterval(1);
      dispatch({ type: AssignmentOptions.CREATE_ASSIGNMENT, payload: data });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="col-start-3 row-start-1">
      <h3 className="text-xl mb-5">
        <strong>Add A New Item</strong>
      </h3>
      <label>Item: </label>
      <input
        className={`${
          emptyFields.includes("title") ? "error border-red-400" : ""
        } p-2 mb-5 border-solid border-2 border-slate-200 focus:border-slate-500 focus:outline-none rounded-lg block w-4/5`}
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <label>Course: </label>
      <input
        className={`${
          emptyFields.includes("course") ? "error border-red-400" : ""
        } p-2 mb-5 border-solid border-2 border-slate-200 focus:border-slate-500 focus:outline-none rounded-lg block w-4/5`}
        type="text"
        onChange={(e) => setCourse(e.target.value)}
        value={course}
      />
      <label>Due Date: </label>
      <input
        className={`${
          emptyFields.includes("dueDate")
            ? "error border-red-400"
            : "border-slate-200"
        } p-2 mb-5 border-solid border-2 focus:border-slate-500 focus:outline-none rounded-lg block w-4/5`}
        type="date"
        onChange={(e) => setDueDate(e.target.value)}
        value={dueDate}
      />
      
      <label>Priority: </label>
      <select
        className={`${
          emptyFields.includes("priority") ? "error border-red-400" : ""
        } p-2 mb-5 border-solid border-2 border-slate-200 focus:border-slate-500 rounded-lg block w-4/5`}
        value={priority}
        onChange={(e) => setPriority(e.target.value as any)}
      >
        <option value="none">None</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button
        type="button"
        onClick={() => setShowOptional(prev => !prev)}
        className="mb-5 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        {showOptional ? 'Hide Optional Fields' : 'Show Optional Fields'}
      </button>

      {showOptional && (
        <>
          <label>Due Time: </label>
          <input
            className={`${
              emptyFields.includes("dueTime") ? "error border-red-400" : ""
            } p-2 mb-5 border-solid border-2 focus:border-slate-500 focus:outline-none rounded-lg block w-4/5`}
            type="time"
            value={dueTime}
            onChange={e => setDueTime(e.target.value)}
          />
          
          <label>Description: </label>
          <textarea
            className="p-2 mb-5 border-solid border-2 border-slate-200 focus:border-slate-500 focus:outline-none rounded-lg block w-4/5"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          
          <label>Status: </label>
          <select
            className="p-2 mb-5 border-solid border-2 border-slate-200 focus:border-slate-500 rounded-lg block w-4/5"
            value={status}
            onChange={e => setStatus(e.target.value as any)}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In-Progress</option>
            <option value="completed">Completed</option>
          </select>
          
          <label>Tags (comma separated): </label>
          <input
            className="p-2 mb-5 border-solid border-2 border-slate-200 focus:border-slate-500 focus:outline-none rounded-lg block w-4/5"
            type="text"
            placeholder="e.g. lab, reading"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
          
          <label>
            <input
              type="checkbox"
              checked={reminderEnabled}
              onChange={e => setReminderEnabled(e.target.checked)}
            />
            Enable Reminder
          </label>
          <input
            className="p-2 mb-5 border-solid border-2 focus:border-slate-500 focus:outline-none rounded-lg block w-4/5"
            type="number"
            min="0"
            value={reminderOffset}
            onChange={e => setReminderOffset(Number(e.target.value))}
            placeholder="Reminder offset (minutes)"
          />
          
          <label>Recurrence: </label>
          <select
            className="p-2 mb-5 border-solid border-2 border-slate-200 focus:border-slate-500 rounded-lg block w-4/5"
            value={recurrenceFrequency}
            onChange={e => setRecurrenceFrequency(e.target.value as any)}
          >
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <input
            className="p-2 mb-5 border-solid border-2 focus:border-slate-500 focus:outline-none rounded-lg block w-4/5"
            type="number"
            min="1"
            value={recurrenceInterval}
            onChange={e => setRecurrenceInterval(Number(e.target.value))}
            placeholder="Interval (e.g. every 2 units)"
          />
        </>
      )}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 hover:cursor-pointer text-white p-4 rounded-lg">
        <strong>Add Assignment</strong>
      </button>
      {error && (
        <div className="bg-pink-200 border-solid border-4 border-pink-300 mt-5 p-2 w-4/5">
          {error}
        </div>
      )}
    </form>
  );
};

export default AssignmentForm;
