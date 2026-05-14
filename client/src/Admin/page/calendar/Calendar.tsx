import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
  formatDate,
  type DateSelectArg,
  type EventApi,
  type EventClickArg,
  type EventContentArg,
} from "@fullcalendar/core";

import { Paper, Stack, Box, useMediaQuery, useTheme } from "@mui/material";
import "./calendar.css";

// -----------------------------
// 1) eventContent
// -----------------------------
function renderEventContent(eventInfo: EventContentArg) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

// -----------------------------
// 2) sidebar event
// -----------------------------
function renderSidebarEvent(event: EventApi) {
  return (
    <li key={event.id}>
      <b>
        {formatDate(event.start!, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </b>
      <i>{event.title}</i>
    </li>
  );
}

const Calendar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [weekendsVisible] = useState<boolean>(true);
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);

  let eventGuid = 0;
  function createEventId() {
    return String(eventGuid++);
  }

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  };

  const handleEvents = (events: EventApi[]) => {
    setCurrentEvents(events);
  };

  return (
    <Stack
      direction={isMobile ? "column" : "row"}
      spacing={2}
      sx={{ width: "100%" }}
    >
      {/* Sidebar */}
      <Paper
        className="demo-app-sidebar"
        sx={{
          width: isMobile ? "100%" : "250px",
          p: 2,
          order: isMobile ? 2 : 1,
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          All Events ({currentEvents.length})
        </h2>
        <ul>{currentEvents.map(renderSidebarEvent)}</ul>
      </Paper>

      {/* Calendar */}
      <Box
        className="demo-app-main"
        sx={{
          flexGrow: 1,
          order: isMobile ? 1 : 2,
          width: "100%",
          overflowX: "hidden",
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: isMobile
              ? "dayGridMonth,timeGridDay"
              : "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height={isMobile ? "auto" : "80vh"}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventsSet={handleEvents}
        />
      </Box>
    </Stack>
  );
};

export default Calendar;
