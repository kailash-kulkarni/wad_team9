# Faculty Office

Faculty Office keeps faculty profiles, subjects, class schedules, and teaching hours together in one small web app.

## Open the app

Open `index.html` in a browser. No installation or server is needed.

## What each file does

- `index.html` contains the page structure and navigation.
- `style.css` controls the colors, layout, and small-screen design.
- `app.js` contains the sample records and the actions behind the app.

## Main sections

- **Overview** summarizes faculty, subjects, class sessions, and teaching hours.
- **Faculty** lets administrators add, edit, search, filter, export, and remove faculty profiles.
- **Subjects** maintains the subject catalog and course credits.
- **Schedule** assigns a subject, faculty member, day, time, and room to each class.
- **Workload** totals each faculty member's scheduled class hours and compares the total with an 18-hour guideline.

## How the data works

The app starts with sample faculty, subject, and schedule records in `app.js`. New and edited records are saved in this browser's local storage, so they remain after the page is closed. They are not shared with other computers or users; this version has no server or sign-in system.

Teaching hours are calculated from each class's start and end time. Adding or removing a scheduled class updates the workload totals automatically. Roster, schedule, and workload views can be exported as CSV files for spreadsheets.

## A short explanation for faculty

> Faculty Office is a simple department workspace. It keeps faculty contact details and subjects in a directory, shows when classes meet, and totals scheduled teaching hours for each instructor. Changes are saved in the browser, and the tables can be exported for reporting.