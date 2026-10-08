const seed = {
  faculty: [{
    id: "f1",
    name: "Dr. Maya Patel",
    email: "maya.patel@northfield.edu",
    department: "Computer Science",
    title: "Associate Professor",
    status: "Active",
    office: "Science 304"
  }, {
    id: "f2",
    name: "Prof. Elias Chen",
    email: "elias.chen@northfield.edu",
    department: "Mathematics",
    title: "Professor",
    status: "Active",
    office: "West Hall 218"
  }, {
    id: "f3",
    name: "Dr. Sofia Ramirez",
    email: "sofia.ramirez@northfield.edu",
    department: "Biology",
    title: "Assistant Professor",
    status: "Active",
    office: "Life Sciences 112"
  }, {
    id: "f4",
    name: "Dr. Noah Williams",
    email: "noah.williams@northfield.edu",
    department: "Computer Science",
    title: "Assistant Professor",
    status: "Active",
    office: "Science 318"
  }, {
    id: "f5",
    name: "Prof. Amara Okafor",
    email: "amara.okafor@northfield.edu",
    department: "English",
    title: "Professor",
    status: "On leave",
    office: "Arts 207"
  }, {
    id: "f6",
    name: "Dr. Lucas Bennett",
    email: "lucas.bennett@northfield.edu",
    department: "Mathematics",
    title: "Associate Professor",
    status: "Active",
    office: "West Hall 205"
  }, {
    id: "f7",
    name: "Dr. Priya Nair",
    email: "priya.nair@northfield.edu",
    department: "Biology",
    title: "Assistant Professor",
    status: "Active",
    office: "Life Sciences 128"
  }, {
    id: "f8",
    name: "Prof. Theo Martin",
    email: "theo.martin@northfield.edu",
    department: "English",
    title: "Associate Professor",
    status: "Active",
    office: "Arts 214"
  }],
  subjects: [{
    id: "s1",
    code: "CS 301",
    name: "Data Structures & Algorithms",
    department: "Computer Science",
    credits: 4
  }, {
    id: "s2",
    code: "CS 220",
    name: "Database Systems",
    department: "Computer Science",
    credits: 3
  }, {
    id: "s3",
    code: "MATH 240",
    name: "Linear Algebra",
    department: "Mathematics",
    credits: 3
  }, {
    id: "s4",
    code: "MATH 115",
    name: "Calculus I",
    department: "Mathematics",
    credits: 4
  }, {
    id: "s5",
    code: "BIO 210",
    name: "Cellular Biology",
    department: "Biology",
    credits: 4
  }, {
    id: "s6",
    code: "BIO 125",
    name: "Ecology & Environment",
    department: "Biology",
    credits: 3
  }, {
    id: "s7",
    code: "ENG 205",
    name: "Modern Literature",
    department: "English",
    credits: 3
  }, {
    id: "s8",
    code: "ENG 110",
    name: "Academic Writing",
    department: "English",
    credits: 3
  }],
  schedule: [{
    id: "c1",
    subject: "s1",
    faculty: "f1",
    day: "Monday",
    start: "09:00",
    end: "10:30",
    room: "Science 101"
  }, {
    id: "c2",
    subject: "s3",
    faculty: "f2",
    day: "Monday",
    start: "11:00",
    end: "12:30",
    room: "West Hall 202"
  }, {
    id: "c3",
    subject: "s5",
    faculty: "f3",
    day: "Monday",
    start: "13:00",
    end: "14:30",
    room: "Life Sciences 014"
  }, {
    id: "c4",
    subject: "s2",
    faculty: "f4",
    day: "Tuesday",
    start: "10:00",
    end: "11:30",
    room: "Science 204"
  }, {
    id: "c5",
    subject: "s7",
    faculty: "f5",
    day: "Tuesday",
    start: "14:00",
    end: "15:30",
    room: "Arts 105"
  }, {
    id: "c6",
    subject: "s4",
    faculty: "f6",
    day: "Wednesday",
    start: "09:00",
    end: "10:30",
    room: "West Hall 112"
  }, {
    id: "c7",
    subject: "s6",
    faculty: "f7",
    day: "Wednesday",
    start: "13:00",
    end: "14:30",
    room: "Life Sciences 020"
  }, {
    id: "c8",
    subject: "s8",
    faculty: "f8",
    day: "Thursday",
    start: "10:00",
    end: "11:30",
    room: "Arts 203"
  }, {
    id: "c9",
    subject: "s1",
    faculty: "f4",
    day: "Thursday",
    start: "13:00",
    end: "14:30",
    room: "Science 101"
  }, {
    id: "c10",
    subject: "s3",
    faculty: "f6",
    day: "Friday",
    start: "11:00",
    end: "12:30",
    room: "West Hall 202"
  }, {
    id: "c11",
    subject: "s5",
    faculty: "f3",
    day: "Friday",
    start: "14:00",
    end: "15:30",
    room: "Life Sciences 014"
  }]
};
const load = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("facultyOfficeData"));
    return saved?.faculty && saved?.subjects && saved?.schedule ? saved : structuredClone(seed)
  } catch {
    return structuredClone(seed)
  }
};
let data = load(),
  view = "overview",
  query = "",
  department = "all";
const page = document.getElementById("page"),
  modal = document.getElementById("modal"),
  days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const icon = (name) => `<svg aria-hidden="true"><use href="#${name}"/></svg>`,
  safe = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  } [c])),
  initials = (name) => name.replace(/^(Dr\.|Prof\.)\s*/, "").split(/\s+/).map(x => x[0]).slice(0, 2).join("").toUpperCase(),
  person = id => data.faculty.find(x => x.id === id),
  subject = id => data.subjects.find(x => x.id === id),
  hours = id => data.schedule.filter(x => x.faculty === id).reduce((sum, session) => sum + sessionHours(session), 0),
  fmtHours = x => Number.isInteger(x) ? String(x) : x.toFixed(1),
  depts = () => [...new Set(data.faculty.map(x => x.department))].sort(),
  save = () => localStorage.setItem("facultyOfficeData", JSON.stringify(data)),
  avatar = p => `<div class="avatar">${safe(initials(p.name))}</div>`,
  classes = x => x >= 18 ? "high" : x >= 14 ? "medium" : "",
  sortSchedule = () => [...data.schedule].sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day) || a.start.localeCompare(b.start)),
  time = x => new Date(`2000-01-01T${x}:00`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
const heading = (eyebrow, title, sub, actions = "") => {
  if (view === "overview") {
    eyebrow = new Intl.DateTimeFormat("en-GB").format(new Date());
    title = "Good morning";
  }
  return `<div class="heading"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${sub}</p></div><div class="heading-actions">${actions}</div></div>`
},
  button = (text, action, primary = false, symbol = "") => `<button class="button${primary?" primary":""}" data-action="${action}">${symbol?icon(symbol):""}${text}</button>`,
  noData = (title, sub) => `<div class="empty-state"><strong>${title}</strong>${sub}</div>`;

function sessionHours(session) {
  const start = Date.parse(`2000-01-01T${session.start}`);
  const end = Date.parse(`2000-01-01T${session.end}`);
  return Math.max(0, (end - start) / 3600000);
}

function totalTeachingHours() {
  return data.schedule.reduce((total, session) => total + sessionHours(session), 0);
}

function overview() {
  let total = totalTeachingHours(),
    loads = [...data.faculty].sort((a, b) => hours(b.id) - hours(a.id)).slice(0, 5),
    events = sortSchedule().slice(0, 5);
  return `${heading("Monday, October 12, 2026","Good morning, Alex","Here’s what’s happening across your department this week.",button("Add faculty","add-faculty",true,"plus"))}<div class="stats"><article class="stat"><div class="stat-top">Faculty members<span class="stat-icon">${icon("users")}</span></div><div class="stat-value">${data.faculty.length}</div><div class="stat-foot"><span class="positive">${data.faculty.filter(x=>x.status==="Active").length} active</span> across ${depts().length} departments</div></article><article class="stat"><div class="stat-top">Subjects offered<span class="stat-icon">${icon("book")}</span></div><div class="stat-value">${data.subjects.length}</div><div class="stat-foot">Across ${depts().length} academic departments</div></article><article class="stat"><div class="stat-top">Teaching hours<span class="stat-icon">${icon("clock")}</span></div><div class="stat-value">${fmtHours(total)}<span class="stat-foot"> hrs this week</span></div><div class="stat-foot">Scheduled contact hours</div></article><article class="stat"><div class="stat-top">Class sessions<span class="stat-icon">${icon("calendar")}</span></div><div class="stat-value">${data.schedule.length}</div><div class="stat-foot">Across 5 teaching days</div></article></div><div class="columns"><section class="panel"><div class="panel-head"><div><div class="panel-title">Weekly faculty workload</div><div class="panel-sub">Teaching hours against an 18-hour weekly guideline</div></div><button class="text-button" data-view="workload">View workload</button></div><div class="load-list">${loads.length?loads.map(p=>`<div class="load-row"><div class="person-mini">${avatar(p)}<div style="min-width:0"><div class="mini-name">${safe(p.name)}</div><div class="mini-dept">${safe(p.department)}</div></div></div><div class="track"><div class="fill ${classes(hours(p.id))}" style="width:${Math.min(hours(p.id)/18*100,100)}%"></div></div><div class="hours">${fmtHours(hours(p.id))}<span> / 18h</span></div></div>`).join(""):noData("No faculty yet","Add profiles to see workload.")}</div></section><section class="panel"><div class="panel-head"><div><div class="panel-title">This week’s schedule</div><div class="panel-sub">${data.schedule.length} department sessions</div></div><button class="text-button" data-view="schedule">Full schedule</button></div><div class="events">${events.length?events.map(x=>`<div class="event-row"><div class="event-time">${time(x.start)}</div><div class="event-rule"></div><div><div class="event-title">${safe(subject(x.subject)?.name||"Unassigned subject")}</div><div class="event-meta">${safe(person(x.faculty)?.name||"Unassigned faculty")} · ${safe(x.room)}</div></div><div class="event-day">${x.day.slice(0,3)}</div></div>`).join(""):noData("No sessions","Add a class to build the schedule.")}</div></section></div><section class="panel"><div class="panel-head"><div><div class="panel-title">Faculty directory</div><div class="panel-sub">A quick look at your department roster</div></div><button class="text-button" data-view="faculty">View directory</button></div>${facultyTable(data.faculty.slice(0,4),false)}</section><div class="footer-note">Faculty Office · Academic year 2026–27</div>`
}

function facultyTable(people, editable = true) {
  return `<div class="table-wrap"><table><thead><tr><th>Faculty member</th><th>Department</th><th>Position</th>${editable?"<th>Office</th>":""}<th>Weekly hours</th><th>Status</th>${editable?"<th></th>":""}</tr></thead><tbody>${people.length?people.map(p=>`<tr><td><div class="faculty-cell">${avatar(p)}<div><div class="person-name"><button class="faculty-name" type="button" data-action="view-faculty" data-id="${p.id}" aria-label="View profile for ${safe(p.name)}">${safe(p.name)}</button></div><div class="person-email">${safe(p.email)}</div></div></div></td><td>${safe(p.department)}</td><td>${safe(p.title)}</td>${editable?`<td>${safe(p.office||"—")}</td>`:""}<td>${fmtHours(hours(p.id))} hrs</td><td><span class="status ${p.status==="On leave"?"leave":""}">${safe(p.status)}</span></td>${editable?`<td><div class="actions"><button class="button icon-only" data-action="edit-faculty" data-id="${p.id}" title="Edit profile" aria-label="Edit ${safe(p.name)}">${icon("edit")}</button><button class="button icon-only" data-action="delete-faculty" data-id="${p.id}" title="Delete profile" aria-label="Delete ${safe(p.name)}">${icon("trash")}</button></div></td>`:""}</tr>`).join(""):`<tr><td colspan="7">${noData("No faculty found","Try another search or add a profile.")}</td></tr>`}</tbody></table></div>`
}

function facultyView() {
  let list = data.faculty.filter(p => `${p.name} ${p.email} ${p.department} ${p.title}`.toLowerCase().includes(query.toLowerCase()) && (department === "all" || p.department === department));
  return `${heading("People","Faculty directory","Manage faculty profiles, departments, and teaching assignments.",`${button("Export roster","export-faculty",false,"download")}${button("Add faculty","add-faculty",true,"plus")}`)}<section class="panel table-panel"><div class="toolbar"><div class="toolbar-left"><label class="search-wrap">${icon("search")}<input class="search" id="search" type="search" placeholder="Search faculty..." value="${safe(query)}" aria-label="Search faculty"></label><select class="filter" id="department" aria-label="Filter by department"><option value="all">All departments</option>${depts().map(d=>`<option value="${safe(d)}" ${d===department?"selected":""}>${safe(d)}</option>`).join("")}</select></div><div class="toolbar-right"><span style="font-size:10px;color:#87918a">${list.length} of ${data.faculty.length} faculty</span></div></div>${facultyTable(list)}</section><div class="footer-note">Faculty Office · Academic year 2026–27</div>`
}

function scheduleView() {
  return `${heading("Teaching","Class schedule","See teaching sessions by day, with assigned faculty and room details.",button("Add class","add-schedule",true,"plus"))}<section class="panel"><div class="panel-head"><div><div class="panel-title">Fall semester · Weekly view</div><div class="panel-sub">${data.schedule.length} class sessions</div></div><button class="button" data-action="export-schedule">${icon("download")}Export schedule</button></div><div class="week">${days.map(day=>{let events=sortSchedule().filter(x=>x.day===day);return `<div class="day"><div class="day-head">${day}<span>${events.length} classes</span></div><div class="day-events">${events.length?events.map(x=>`<div class="day-event"><strong>${safe(subject(x.subject)?.code)} · ${safe(subject(x.subject)?.name)}</strong><span>${time(x.start)}–${time(x.end)}</span><span>${safe(person(x.faculty)?.name)}</span><span>${safe(x.room)}</span><button class="text-button" data-action="delete-schedule" data-id="${x.id}">Remove session</button></div>`).join(""):`<div class="empty-day">No classes scheduled</div>`}</div></div>`}).join("")}</div></section><div class="notice">${icon("alert")}Workload is calculated from scheduled teaching hours.</div><div class="footer-note">Faculty Office · Academic year 2026–27</div>`
}

function subjectsView() {
  return `${heading("Curriculum","Subjects","Maintain the course catalog and its department assignments.",button("Add subject","add-subject",true,"plus"))}<section class="panel table-panel"><div class="panel-head"><div><div class="panel-title">Course catalog</div><div class="panel-sub">${data.subjects.length} subjects currently offered</div></div></div><div class="table-wrap"><table><thead><tr><th>Course code</th><th>Subject</th><th>Department</th><th>Credits</th><th>Sessions</th><th></th></tr></thead><tbody>${data.subjects.length?data.subjects.map(s=>`<tr><td><span class="subject-code">${safe(s.code)}</span></td><td><span class="person-name">${safe(s.name)}</span></td><td>${safe(s.department)}</td><td>${safe(s.credits)} credits</td><td>${data.schedule.filter(x=>x.subject===s.id).length}</td><td><div class="actions"><button class="button icon-only" data-action="edit-subject" data-id="${s.id}" aria-label="Edit ${safe(s.name)}">${icon("edit")}</button><button class="button icon-only" data-action="delete-subject" data-id="${s.id}" aria-label="Delete ${safe(s.name)}">${icon("trash")}</button></div></td></tr>`).join(""):`<tr><td colspan="6">${noData("No subjects yet","Add a subject to start the catalog.")}</td></tr>`}</tbody></table></div></section><div class="footer-note">Faculty Office · Academic year 2026–27</div>`
}

function workloadView() {
  let people = [...data.faculty].sort((a, b) => hours(b.id) - hours(a.id)),
    total = totalTeachingHours();
  return `${heading("Planning","Faculty workload","Review scheduled teaching hours and balance assignments across your team.",button("Export workload","export-workload",false,"download"))}<div class="stats"><article class="stat"><div class="stat-top">Total teaching hours<span class="stat-icon">${icon("clock")}</span></div><div class="stat-value">${fmtHours(total)} hrs</div><div class="stat-foot">Scheduled across all faculty</div></article><article class="stat"><div class="stat-top">Faculty assigned<span class="stat-icon">${icon("users")}</span></div><div class="stat-value">${people.filter(p=>hours(p.id)>0).length} / ${people.length}</div><div class="stat-foot">Faculty with teaching sessions</div></article><article class="stat"><div class="stat-top">Average per faculty<span class="stat-icon">${icon("chart")}</span></div><div class="stat-value">${people.length?fmtHours(total/people.length):"0"} hrs</div><div class="stat-foot">Across the faculty roster</div></article><article class="stat"><div class="stat-top">Above guideline<span class="stat-icon">${icon("alert")}</span></div><div class="stat-value">${people.filter(p=>hours(p.id)>18).length}</div><div class="stat-foot">More than 18 teaching hours</div></article></div><section class="panel table-panel"><div class="panel-head"><div><div class="panel-title">Individual teaching load</div><div class="panel-sub">Weekly guideline: 18 teaching hours per faculty member</div></div></div><div class="table-wrap"><table><thead><tr><th>Faculty member</th><th>Department</th><th>Assigned subjects</th><th>Teaching sessions</th><th>Weekly load</th><th>Guideline</th></tr></thead><tbody>${people.length?people.map(p=>{let assigned=[...new Set(data.schedule.filter(x=>x.faculty===p.id).map(x=>x.subject))].map(subject).filter(Boolean),load=hours(p.id);return `<tr><td><div class="faculty-cell">${avatar(p)}<div><div class="person-name">${safe(p.name)}</div><div class="person-email">${safe(p.title)}</div></div></div></td><td>${safe(p.department)}</td><td>${assigned.map(s=>`<span class="subject-code">${safe(s.code)}</span>`).join(", ")||"—"}</td><td>${data.schedule.filter(x=>x.faculty===p.id).length} sessions</td><td><strong>${fmtHours(load)} hrs</strong></td><td><div class="capacity"><div class="track"><div class="fill ${classes(load)}" style="width:${Math.min(load/18*100,100)}%"></div></div>${load>18?"Above":`${fmtHours(load/18*100)}%`}</div></td></tr>`}).join(""):` < tr > < td colspan = "6" > $ {
    noData("No faculty records yet", "Add faculty profiles to begin workload planning.")
  } < /td></tr > `}</tbody></table></div></section><div class="notice">${icon("alert")}Workload includes scheduled contact hours only; preparation and office hours are not included.</div><div class="footer-note">Faculty Office · Academic year 2026–27</div>`
}

function render() {
  let views = {
    overview,
    faculty: facultyView,
    schedule: scheduleView,
    subjects: subjectsView,
    workload: workloadView
  };
  page.innerHTML = views[view]();
  document.getElementById("crumb").textContent = {
    overview: "Overview",
    faculty: "Faculty",
    schedule: "Schedule",
    subjects: "Subjects",
    workload: "Workload"
  } [view];
  document.getElementById("facultyCount").textContent = data.faculty.length;
  document.getElementById("subjectCount").textContent = data.subjects.length;
  document.querySelectorAll(".nav-button").forEach(b => b.classList.toggle("active", b.dataset.view === view))
}

function notify(text) {
  let el = document.getElementById("toast");
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => el.classList.remove("show"), 2500)
}

function field(label, name, value = "", type = "text", required = true, options = null, full = false) {
  return `<div class="field${full?" full":""}"><label for="f-${name}">${label}${required?" *":""}</label>${options?`<select class="control" id="f-${name}" name="${name}" ${required?"required":""}>${options.map(o=>`<option value="${safe(o.value)}" ${o.value===value?"selected":""}>${safe(o.label)}</option>`).join("")}</select>`:`<input class="control" id="f-${name}" name="${name}" type="${type}" value="${safe(value)}" ${required?"required":""}>`}</div>`
}

function subjectAllocationField(selectedIds = []) {
  const checkboxes = data.subjects.map(course => `
    <label class="subject-option">
      <input type="checkbox" name="allocatedSubjects" value="${course.id}" ${selectedIds.includes(course.id) ? "checked" : ""}>
      <span><strong>${safe(course.code)}</strong> · ${safe(course.name)}</span>
      <small>${safe(course.department)} · ${safe(course.credits)} credits</small>
    </label>
  `).join("");

  return `<div class="field full"><span class="field-label">Subjects allocated</span><div class="subject-options">${checkboxes || `<span class="profile-empty">Add subjects in the Subjects section first.</span>`}</div></div>`;
}

function showForm(type, id = null) {
  let edit = !!id,
    old = edit ? (type === "faculty" ? person(id) : data.subjects.find(s => s.id === id)) : {};
  if (type === "schedule" && (!data.faculty.length || !data.subjects.length)) {
    notify("Add faculty and a subject before scheduling a class.");
    return
  }
  let config = {
    faculty: {
      title: edit ? "Edit faculty profile" : "Add faculty member",
      sub: "Keep faculty contact and department details current.",
      fields: () => field("Full name", "name", old.name || "") +
        field("Email address", "email", old.email || "", "email") +
        field("Department", "department", old.department || depts()[0] || "General", "text", true, (depts().length ? depts() : ["General"]).map(x => ({
          value: x,
          label: x
        }))) +
        field("Academic title", "title", old.title || "Assistant Professor", "text", true, ["Professor", "Associate Professor", "Assistant Professor", "Lecturer", "Instructor"].map(x => ({
          value: x,
          label: x
        }))) +
        field("Office location", "office", old.office || "", "text", false) +
        field("Status", "status", old.status || "Active", "text", true, ["Active", "On leave"].map(x => ({
          value: x,
          label: x
        }))) +
        subjectAllocationField(old.allocatedSubjects || [])
    },
    subjects: {
      title: edit ? "Edit subject" : "Add subject",
      sub: "Add a course to the department catalog.",
      fields: () => field("Course code", "code", old.code || "") + field("Subject name", "name", old.name || "") + field("Department", "department", old.department || depts()[0] || "General", "text", true, (depts().length ? depts() : ["General"]).map(x => ({
        value: x,
        label: x
      }))) + field("Credits", "credits", old.credits || 3, "number")
    },
    schedule: {
      title: "Schedule a class",
      sub: "Assign a course, instructor, and weekly time slot.",
      fields: () => field("Subject", "subject", data.subjects[0]?.id || "", "text", true, data.subjects.map(x => ({
        value: x.id,
        label: `${x.code} · ${x.name}`
      }))) + field("Faculty member", "faculty", data.faculty.find(x => x.status === "Active")?.id || "", "text", true, data.faculty.filter(x => x.status === "Active").map(x => ({
        value: x.id,
        label: x.name
      }))) + field("Day", "day", "Monday", "text", true, days.map(x => ({
        value: x,
        label: x
      }))) + field("Room", "room", "") + field("Start time", "start", "09:00", "time") + field("End time", "end", "10:30", "time")
    }
  } [type];
  modal.innerHTML = `<div class="modal-head"><div><h2>${config.title}</h2><p>${config.sub}</p></div><button class="modal-close" type="button" data-action="close" aria-label="Close">${icon("close")}</button></div><form id="form" class="form" data-type="${type}" data-id="${id||""}"><div class="form-grid">${config.fields()}</div><div class="form-footer"><button class="button" type="button" data-action="close">Cancel</button><button class="button primary" type="submit">${edit?"Save changes":type==="schedule"?"Add to schedule":"Add record"}</button></div></form>`;
  modal.showModal();
  modal.querySelector("input")?.focus()
}

function showFacultyDetails(id) {
  const facultyMember = person(id);
  if (!facultyMember) return;

  const sessions = sortSchedule().filter(session => session.faculty === id);
  const allocatedIds = facultyMember.allocatedSubjects || [];
  const selectedSubjectIds = [...new Set([...allocatedIds, ...sessions.map(session => session.subject)])];
  const assignedSubjects = selectedSubjectIds
    .map(subject)
    .filter(Boolean);

  const detail = (label, value) => `<div class="profile-detail"><span>${label}</span><strong>${safe(value || "Not provided")}</strong></div>`;
  const classList = sessions.length
    ? sessions.map(session => {
      const course = subject(session.subject);
      return `<div class="profile-class"><strong>${safe(session.day)} · ${time(session.start)}–${time(session.end)}</strong><span>${safe(course?.code || "Subject")} · ${safe(course?.name || "Unassigned")}</span><span>${safe(session.room || "Room not set")}</span></div>`;
    }).join("")
    : `<p class="profile-empty">No classes scheduled.</p>`;
  modal.innerHTML = `<div class="modal-head"><div><h2>${safe(facultyMember.name)}</h2><p>${safe(facultyMember.title)} · ${safe(facultyMember.department)}</p></div><button class="modal-close" type="button" data-action="close" aria-label="Close">${icon("close")}</button></div><div class="profile-body"><div class="profile-grid">${detail("Department", facultyMember.department)}${detail("Academic title", facultyMember.title)}${detail("Email", facultyMember.email)}${detail("Office", facultyMember.office)}${detail("Status", facultyMember.status)}${detail("Weekly teaching hours", `${fmtHours(hours(id))} hours`)}</div><button class="button profile-subject-toggle" type="button" data-action="toggle-subjects" aria-expanded="false">Subjects assigned (${assignedSubjects.length})</button><div class="profile-subject-details" hidden>${subjectAllocationField(selectedSubjectIds)}<div class="profile-allocation-actions"><button class="button primary" type="button" data-action="save-subjects" data-id="${id}">Save subjects</button></div></div><h3 class="profile-section-title">Scheduled classes (${sessions.length})</h3><div class="profile-classes">${classList}</div></div>`;
  modal.showModal();
}

const csv = (filename, headers, rows) => {
  let text = [headers, ...rows].map(row => row.map(x => `"${String(x??"").replace(/"/g,'""')}"`).join(",")).join("\r\n"),
    a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["\uFEFF", text], {
    type: "text/csv;charset=utf-8"
  }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
  notify("Export downloaded.")
};
document.addEventListener("click", e => {
  let nav = e.target.closest("[data-view]");
  if (nav) {
    view = nav.dataset.view;
    query = "";
    department = "all";
    document.getElementById("sidebar").classList.remove("open");
    render();
    return
  }
  let b = e.target.closest("[data-action]");
  if (!b) return;
  let {
    id,
    action
  } = b.dataset;
  if (action === "save-subjects") {
    const facultyMember = person(id);
    facultyMember.allocatedSubjects = [...modal.querySelectorAll("input[name='allocatedSubjects']:checked")].map(input => input.value);
    save();
    showFacultyDetails(id);
    notify("Subject assignments saved.");
  }
  if (action === "toggle-subjects") {
    const subjectDetails = modal.querySelector(".profile-subject-details");
    subjectDetails.hidden = !subjectDetails.hidden;
    b.setAttribute("aria-expanded", String(!subjectDetails.hidden));
  }
  if (action === "view-faculty") showFacultyDetails(id);
  if (action === "add-faculty") showForm("faculty");
  if (action === "edit-faculty") showForm("faculty", id);
  if (action === "add-subject") showForm("subjects");
  if (action === "edit-subject") showForm("subjects", id);
  if (action === "add-schedule") showForm("schedule");
  if (action === "close") modal.close();
  if (action === "delete-faculty" && confirm(`Delete ${person(id)?.name}? Their classes will also be removed.`)) {
    data.faculty = data.faculty.filter(x => x.id !== id);
    data.schedule = data.schedule.filter(x => x.faculty !== id);
    save();
    render();
    notify("Faculty profile removed.")
  }
  if (action === "delete-subject" && confirm(`Delete ${subject(id)?.code}? Its class sessions will also be removed.`)) {
    data.subjects = data.subjects.filter(x => x.id !== id);
    data.schedule = data.schedule.filter(x => x.subject !== id);
    save();
    render();
    notify("Subject removed.")
  }
  if (action === "delete-schedule" && confirm("Remove this class session?")) {
    data.schedule = data.schedule.filter(x => x.id !== id);
    save();
    render();
    notify("Class session removed.")
  }
  if (action === "export-faculty") csv("faculty-roster.csv", ["Name", "Email", "Department", "Title", "Office", "Status", "Weekly teaching hours"], data.faculty.map(p => [p.name, p.email, p.department, p.title, p.office, p.status, fmtHours(hours(p.id))]));
  if (action === "export-schedule") csv("faculty-schedule.csv", ["Day", "Start", "End", "Course code", "Subject", "Faculty", "Room"], sortSchedule().map(x => [x.day, x.start, x.end, subject(x.subject)?.code, subject(x.subject)?.name, person(x.faculty)?.name, x.room]));
  if (action === "export-workload") csv("faculty-workload.csv", ["Faculty", "Department", "Teaching sessions", "Teaching hours", "Guideline hours"], data.faculty.map(p => [p.name, p.department, data.schedule.filter(x => x.faculty === p.id).length, fmtHours(hours(p.id)), 18]))
});
document.addEventListener("input", e => {
  if (e.target.id === "search") {
    query = e.target.value;
    let start = e.target.selectionStart;
    render();
    let input = document.getElementById("search");
    input.focus();
    input.setSelectionRange(start, start)
  }
});
document.addEventListener("change", e => {
  if (e.target.id === "department") {
    department = e.target.value;
    render()
  }
});
document.addEventListener("submit", e => {
  if (e.target.id !== "form") return;
  e.preventDefault();
  let form = e.target,
    type = form.dataset.type,
    id = form.dataset.id,
    formData = new FormData(form),
    values = Object.fromEntries(formData);
  if (type === "faculty") values.allocatedSubjects = formData.getAll("allocatedSubjects");
  if (type === "schedule" && values.end <= values.start) {
    notify("End time must be later than start time.");
    return
  }
  if (type === "faculty" && data.faculty.some(x => x.email.toLowerCase() === values.email.toLowerCase() && x.id !== id)) {
    notify("That email address is already in the directory.");
    return
  }
  if (type === "subjects" && data.subjects.some(x => x.code.toLowerCase() === values.code.toLowerCase() && x.id !== id)) {
    notify("That course code is already in the catalog.");
    return
  }
  if (type === "subjects") values.credits = Number(values.credits);
  if (id) {
    let list = type === "faculty" ? data.faculty : data.subjects,
      index = list.findIndex(x => x.id === id);
    list[index] = {
      ...list[index],
      ...values
    }
  } else data[type].push({
    id: crypto.randomUUID(),
    ...values
  });
  save();
  modal.close();
  render();
  notify(id ? "Changes saved." : type === "schedule" ? "Class added to schedule." : type === "faculty" ? "Faculty member added." : "Subject added to catalog.")
});
document.getElementById("menu").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
modal.addEventListener("click", e => {
  if (e.target === modal) modal.close()
});
render();
