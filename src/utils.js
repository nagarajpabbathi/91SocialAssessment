export const generateCalendarData = (year, month) => {
    const calendarData = [];

    // Create a new date object for the first day of the month
    const startDate = new Date(year, month - 1, 1);

    // Find the starting day and the number of days in the month
    const startDay = startDate.getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    // Calculate the number of days from the previous month to display
    const prevMonthDays = startDay === 0 ? 6 : startDay - 1;
    const prevMonthStartDate = new Date(year, month - 2, 1);
    const prevMonthEndDate = new Date(year, month - 1, 0).getDate();

    // Generate calendar data for the previous month
    for (let i = prevMonthEndDate - prevMonthDays + 1; i <= prevMonthEndDate; i++) {
        const dateString = `${prevMonthStartDate.getFullYear()}-${prevMonthStartDate.getMonth() + 1}-${i}`;
        calendarData.push({ date: dateString });
    }

    // Generate calendar data for the current month
    let todayDay = new Date().getDate()

    for (let i = 1; i <= daysInMonth; i++) {
        const dateString = `${year}-${month}-${i}`;
        let data = {
            date: dateString, isCurrentMonth: true
        }

        if (todayDay === i) {
            data.isToday = true;
        }
        calendarData.push(data);
    }

    // Calculate the number of days from the next month to display
    const nextMonthDays = 42 - calendarData.length;
    const nextMonthStartDate = new Date(year, month, 1);

    // Generate calendar data for the next month
    for (let i = 1; i <= nextMonthDays; i++) {
        const dateString = `${nextMonthStartDate.getFullYear()}-${nextMonthStartDate.getMonth() + 2}-${i}`;
        calendarData.push({ date: dateString });
    }

    return calendarData;
}


export const sortingObjectsByDate = (data, property) => data.sort((a, b) => new Date(a[property]) - new Date(b[property]));
