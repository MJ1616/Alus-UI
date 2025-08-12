// src/SchedulePlanner.jsx
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './SchedulePlanner.css';

export default function SchedulePlanner() {
  const [events, setEvents] = useState([
  {
    id: '1',
    title: 'Korean Study',
    start: '2025-01-27T06:30:00',
    end: '2025-01-27T07:30:00',
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50'
    },
    {
      id: '2',
      title: 'Workout',
      start: '2025-01-27T17:30:00',
      end: '2025-01-27T18:30:00',
      backgroundColor: '#2196F3',
      borderColor: '#2196F3'
    }
  ]);

  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm your AI scheduling assistant. I can help you create, modify, and optimize your schedule. What would you like to do today?",
      timestamp: new Date()
    }
  ]);

  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(true);

  const handleEventAdd = (addInfo) => {
    const newEvent = {
      id: Date.now().toString(),
      title: addInfo.event.title,
      start: addInfo.event.start,
      end: addInfo.event.end,
      backgroundColor: '#FF9800',
      borderColor: '#FF9800'
    };
    setEvents([...events, newEvent]);
  };

  const handleEventChange = (changeInfo) => {
    const updatedEvents = events.map(event => 
      event.id === changeInfo.event.id 
        ? {
            ...event,
            start: changeInfo.event.start,
            end: changeInfo.event.end,
            title: changeInfo.event.title
          }
        : event
    );
    setEvents(updatedEvents);
  };

  const handleEventDelete = (deleteInfo) => {
    const updatedEvents = events.filter(event => event.id !== deleteInfo.event.id);
    setEvents(updatedEvents);
  };

  const handleDateSelect = (selectInfo) => {
    const title = window.prompt('Please enter a title for your event');
    if (title) {
      const newEvent = {
        id: Date.now().toString(),
        title: title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        backgroundColor: '#FF9800',
        borderColor: '#FF9800'
      };
      setEvents([...events, newEvent]);
    }
    selectInfo.view.calendar.unselect(); // clear date selection
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: userInput,
      timestamp: new Date()
    };

    setAiMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call to Spring Boot backend
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          currentSchedule: events
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: data.response,
          timestamp: new Date()
        };
        setAiMessages(prev => [...prev, aiResponse]);

        // If AI suggests schedule changes, apply them
        if (data.scheduleUpdates) {
          setEvents(data.scheduleUpdates);
        }
      } else {
        // Fallback for demo purposes
        setTimeout(() => {
          const demoResponse = {
            id: Date.now() + 1,
            type: 'ai',
            content: "I understand you want to schedule something. I'm currently in demo mode, but I can help you organize your time better! Try adding events directly to the calendar.",
            timestamp: new Date()
          };
          setAiMessages(prev => [...prev, demoResponse]);
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm having trouble connecting right now. You can still manage your schedule manually!",
        timestamp: new Date()
      };
      setAiMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="scheduler-container">
      <header className="scheduler-header">
        <h1>AI Schedule Planner</h1>
        <button 
          className="chat-toggle"
          onClick={() => setShowChat(!showChat)}
        >
          {showChat ? 'Hide AI Assistant' : 'Show AI Assistant'}
        </button>
      </header>

      <div className="main-content">
        <div className="calendar-section">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            editable={true}
            selectable={true}
            events={events}
            select={handleDateSelect}
            eventAdd={handleEventAdd}
            eventChange={handleEventChange}
            eventRemove={handleEventDelete}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            height="auto"
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={false}
            nowIndicator={true}
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5],
              startTime: '09:00',
              endTime: '17:00',
            }}
          />
        </div>

        {showChat && (
          <div className="chat-section">
            <div className="chat-header">
              <h3>AI Assistant</h3>
            </div>
            
            <div className="chat-messages">
              {aiMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`message ${message.type}`}
                >
                  <div className="message-content">
                    {message.content}
                  </div>
                  <div className="message-timestamp">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message ai">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="chat-input">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me to help with your schedule..."
                disabled={isLoading}
              />
              <button 
                onClick={sendMessage}
                disabled={isLoading || !userInput.trim()}
                className="send-button"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
