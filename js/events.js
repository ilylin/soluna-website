document.addEventListener('DOMContentLoaded', () => {
  const eventsList = document.querySelector('[data-events-list]');
  if (!eventsList) return;

  loadEvents();

  async function loadEvents() {
    try {
      const response = await fetch('events.json', {
        cache: 'no-cache',
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error(`Events request failed with status ${response.status}.`);
      }

      const data = await response.json();
      if (!Array.isArray(data.events)) {
        throw new Error('events.json must contain an events array.');
      }

      const events = data.events
        .filter(event => event.published !== false)
        .map((event, index) => normalizeEvent(event, index))
        .sort((a, b) => a.startDate - b.startDate);

      eventsList.replaceChildren();

      if (events.length === 0) {
        showMessage('No upcoming events are listed right now. Please check back soon.');
        return;
      }

      events.forEach(event => eventsList.appendChild(createEventCard(event)));
    } catch (error) {
      console.error('Unable to load events:', error);
      showMessage('We could not load upcoming events. Please refresh the page or contact us directly.', true);
    }
  }

  function normalizeEvent(event, index) {
    const eventNumber = index + 1;
    const startDate = parseDate(event.startDate, `Event ${eventNumber} startDate`);
    const endDate = parseDate(event.endDate || event.startDate, `Event ${eventNumber} endDate`);

    if (endDate < startDate) {
      throw new Error(`Event ${eventNumber} endDate cannot be before startDate.`);
    }

    if (!event.title || typeof event.title !== 'string') {
      throw new Error(`Event ${eventNumber} needs a title.`);
    }

    const description = Array.isArray(event.description)
      ? event.description.filter(paragraph => typeof paragraph === 'string' && paragraph.trim())
      : [];

    return {
      title: event.title,
      startDate,
      endDate,
      location: typeof event.location === 'string' ? event.location : '',
      description,
      image: typeof event.image === 'string' ? event.image : '',
      imageAlt: typeof event.imageAlt === 'string' ? event.imageAlt : event.title,
      link: typeof event.link === 'string' ? event.link : '',
      buttonText: typeof event.buttonText === 'string' && event.buttonText.trim()
        ? event.buttonText
        : 'View Event'
    };
  }

  function parseDate(value, fieldName) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error(`${fieldName} must use YYYY-MM-DD format.`);
    }

    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(`${value}T00:00:00`);
    if (
      Number.isNaN(date.getTime())
      || date.getFullYear() !== year
      || date.getMonth() !== month - 1
      || date.getDate() !== day
    ) {
      throw new Error(`${fieldName} is not a valid date.`);
    }

    return date;
  }

  function createEventCard(event) {
    const card = createElement('article', 'glass-card event-card');
    const dateBadge = createElement('div', 'event-date');
    dateBadge.append(
      createElement('div', 'month', event.startDate.toLocaleDateString('en-US', { month: 'short' })),
      createElement('div', 'day', formatBadgeDays(event.startDate, event.endDate))
    );

    const info = createElement('div', 'event-info');

    if (event.image) {
      const image = document.createElement('img');
      image.className = 'event-logo';
      image.src = event.image;
      image.alt = event.imageAlt;
      image.loading = 'lazy';
      info.appendChild(image);
    }

    info.appendChild(createElement('h3', '', event.title));

    const metaParts = [formatDateRange(event.startDate, event.endDate)];
    if (event.location) metaParts.push(event.location);
    info.appendChild(createElement('div', 'event-meta', metaParts.join(' | ')));

    event.description.forEach(paragraph => {
      info.appendChild(createElement('p', '', paragraph));
    });

    if (event.link) {
      const link = createElement('a', 'btn btn-outline event-link', event.buttonText);
      link.href = event.link;
      if (/^https?:\/\//i.test(event.link)) {
        link.target = '_blank';
        link.rel = 'noopener';
      }
      info.appendChild(link);
    }

    card.append(dateBadge, info);
    return card;
  }

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function formatBadgeDays(startDate, endDate) {
    if (sameDay(startDate, endDate)) return String(startDate.getDate());
    if (sameMonth(startDate, endDate)) return `${startDate.getDate()}–${endDate.getDate()}`;
    return `${startDate.getDate()}–${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }

  function formatDateRange(startDate, endDate) {
    const fullDate = { month: 'long', day: 'numeric', year: 'numeric' };
    if (sameDay(startDate, endDate)) {
      return startDate.toLocaleDateString('en-US', fullDate);
    }

    if (sameMonth(startDate, endDate)) {
      const month = startDate.toLocaleDateString('en-US', { month: 'long' });
      return `${month} ${startDate.getDate()}–${endDate.getDate()}, ${startDate.getFullYear()}`;
    }

    if (startDate.getFullYear() === endDate.getFullYear()) {
      const start = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      const end = endDate.toLocaleDateString('en-US', fullDate);
      return `${start} – ${end}`;
    }

    return `${startDate.toLocaleDateString('en-US', fullDate)} – ${endDate.toLocaleDateString('en-US', fullDate)}`;
  }

  function sameDay(first, second) {
    return first.getFullYear() === second.getFullYear()
      && first.getMonth() === second.getMonth()
      && first.getDate() === second.getDate();
  }

  function sameMonth(first, second) {
    return first.getFullYear() === second.getFullYear()
      && first.getMonth() === second.getMonth();
  }

  function showMessage(message, isError = false) {
    const status = createElement('p', `events-message${isError ? ' error' : ''}`, message);
    eventsList.replaceChildren(status);
  }
});
