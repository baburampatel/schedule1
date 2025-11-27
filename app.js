// Application State
const AppState = {
    dataLoaded: false,
    scheduleGenerated: false,
    optimizationRunning: false,

    // Undo/Redo history
    history: [],
    historyIndex: -1,

    draggedEventId: null,
    selectedEventId: null,
    
    // Sample data from JSON
    sampleData: {
        courses: [
            {"course_id": "CS101", "course_name": "Intro to Programming", "num_sessions": 3, "session_length_minutes": 90, "required_equipment": "computers,projector", "student_group_ids": "G1,G2", "enrollment_count": 45},
            {"course_id": "CS102", "course_name": "Data Structures", "num_sessions": 4, "session_length_minutes": 75, "required_equipment": "computers,projector,whiteboard", "student_group_ids": "G2,G3", "enrollment_count": 35},
            {"course_id": "MATH201", "course_name": "Calculus II", "num_sessions": 4, "session_length_minutes": 60, "required_equipment": "whiteboard", "student_group_ids": "G1,G4", "enrollment_count": 30},
            {"course_id": "MATH202", "course_name": "Linear Algebra", "num_sessions": 3, "session_length_minutes": 90, "required_equipment": "whiteboard,projector", "student_group_ids": "G2,G4", "enrollment_count": 25},
            {"course_id": "PHYS301", "course_name": "Quantum Physics", "num_sessions": 2, "session_length_minutes": 120, "required_equipment": "lab_equipment,projector", "student_group_ids": "G3", "enrollment_count": 20},
            {"course_id": "PHYS302", "course_name": "Thermodynamics", "num_sessions": 3, "session_length_minutes": 90, "required_equipment": "lab_equipment,whiteboard", "student_group_ids": "G3,G4", "enrollment_count": 22}
        ],
        instructors: [
            {"instructor_id": "I001", "name": "Dr. Smith"},
            {"instructor_id": "I002", "name": "Prof. Johnson"},
            {"instructor_id": "I003", "name": "Dr. Brown"},
            {"instructor_id": "I004", "name": "Dr. Davis"},
            {"instructor_id": "I005", "name": "Prof. Wilson"}
        ],
        rooms: [
            {"room_id": "R101", "capacity": 50, "equipment": "computers,projector,whiteboard"},
            {"room_id": "R102", "capacity": 40, "equipment": "projector,whiteboard"},
            {"room_id": "R201", "capacity": 60, "equipment": "projector,whiteboard,audio_system"},
            {"room_id": "R202", "capacity": 35, "equipment": "computers,projector"},
            {"room_id": "LAB101", "capacity": 25, "equipment": "lab_equipment,computers,projector"},
            {"room_id": "LAB102", "capacity": 30, "equipment": "lab_equipment,whiteboard,projector"}
        ],
        studentGroups: [
            {"group_id": "G1", "name": "Computer Science Year 1"},
            {"group_id": "G2", "name": "Computer Science Year 2"},
            {"group_id": "G3", "name": "Physics Graduate"},
            {"group_id": "G4", "name": "Mathematics Year 2"}
        ]
    },
    
    // Current schedule data
    scheduleData: [],
    
    // Metrics
    currentMetrics: {
        hardConflicts: 0,
        softViolations: 0,
        fitness: 0.0
    },
    
    // Configuration
    config: {
        populationSize: 100,
        generations: 200,
        mutationRate: 0.15,
        crossoverRate: 0.8,
        hardConstraintWeight: 10,
        softConstraintWeight: 1,
        maxRuntime: 10,
        targetFitness: 95
    }
};

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    initUI();
    initCalendarGrid();
    initKeyboardShortcuts();
    updateUIState();
});

function initUI() {
    // Data Loading
    document.getElementById('load-sample-data').addEventListener('click', loadSampleData);
    
    // Optimizer Controls
    document.getElementById('toggle-config').addEventListener('click', () => {
        const panel = document.getElementById('config-panel');
        panel.classList.toggle('hidden');
    });
    
    document.getElementById('start-optimization').addEventListener('click', runOptimizer);
    document.getElementById('stop-optimization').addEventListener('click', stopOptimizer);
    document.getElementById('undo-btn').addEventListener('click', undoAction);
    
    // Inputs
    document.getElementById('generations').addEventListener('input', (e) => {
        document.getElementById('generations-val').textContent = e.target.value;
    });
    document.getElementById('mutation-rate').addEventListener('input', (e) => {
        document.getElementById('mutation-rate-value').textContent = e.target.value;
    });

    // Exports
    document.getElementById('export-csv').addEventListener('click', () => showToast('Exporting to CSV...', 'info'));
    document.getElementById('export-json').addEventListener('click', () => showToast('Exporting to JSON...', 'info'));
}

// --- Logic ---

function updateUIState() {
    // Update data summary
    const summary = document.getElementById('data-summary');
    if (AppState.dataLoaded) {
        summary.classList.remove('hidden');
        document.getElementById('start-optimization').disabled = false;
        
        // Update counts
        document.getElementById('courses-count').textContent = AppState.sampleData.courses.length;
        document.getElementById('instructors-count').textContent = AppState.sampleData.instructors.length;
        document.getElementById('rooms-count').textContent = AppState.sampleData.rooms.length;
        document.getElementById('groups-count').textContent = AppState.sampleData.studentGroups.length;
    }
    
    // Update optimizer stats
    document.getElementById('final-fitness-score').textContent = AppState.currentMetrics.fitness.toFixed(1);
    document.getElementById('live-conflicts').textContent = AppState.currentMetrics.hardConflicts;
    document.getElementById('live-violations').textContent = AppState.currentMetrics.softViolations;

    // Update undo button
    document.getElementById('undo-btn').disabled = AppState.historyIndex < 0;
}

function loadSampleData() {
    showLoading('Loading data...');
    setTimeout(() => {
        AppState.dataLoaded = true;
        hideLoading();
        updateUIState();
        showToast('Sample data loaded successfully', 'success');

        // Render Chips (Constraints)
        renderConstraintChips();
    }, 800);
}

function renderConstraintChips() {
    const chipContainer = document.getElementById('constraint-chips');
    chipContainer.innerHTML = '';

    // Add a few sample chips
    const chips = [
        { type: 'instructor', text: 'Dr. Smith', id: 'I001' },
        { type: 'room', text: 'R101', id: 'R101' },
        { type: 'course', text: 'CS101', id: 'C001' }
    ];
    
    chips.forEach(chip => {
        const el = document.createElement('div');
        el.className = `chip chip-${chip.type}`;
        el.textContent = chip.text;
        el.draggable = true;

        // Constraint Drag Data
        el.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('application/json', JSON.stringify({
                type: 'chip',
                chipType: chip.type,
                text: chip.text
            }));
        });

        chipContainer.appendChild(el);
    });
}

function runOptimizer() {
    if (!AppState.dataLoaded) return;
    
    AppState.optimizationRunning = true;
    document.getElementById('start-optimization').disabled = true;
    document.getElementById('stop-optimization').disabled = false;
    document.getElementById('progress-section').classList.remove('hidden');
    document.getElementById('progress-text').classList.remove('hidden');
    
    // Simulate optimization
    let progress = 0;
    let fitness = 30;
    
    const interval = setInterval(() => {
        if (!AppState.optimizationRunning) {
            clearInterval(interval);
            return;
        }
        
        progress += 5;
        fitness += Math.random() * 5;
        
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('final-fitness-score').textContent = Math.min(fitness, 98).toFixed(1);
        document.getElementById('progress-text').textContent = `Generation ${Math.floor(progress * 2)}...`;
        
        if (progress >= 100) {
            clearInterval(interval);
            completeOptimizer();
        }
    }, 150);
}

function stopOptimizer() {
    AppState.optimizationRunning = false;
    document.getElementById('start-optimization').disabled = false;
    document.getElementById('stop-optimization').disabled = true;
    showToast('Optimizer stopped', 'warning');
}

function completeOptimizer() {
    AppState.optimizationRunning = false;
    AppState.scheduleGenerated = true;
    document.getElementById('start-optimization').disabled = false;
    document.getElementById('stop-optimization').disabled = true;
    document.getElementById('progress-section').classList.add('hidden');
    document.getElementById('progress-text').classList.add('hidden');

    generateMockSchedule();
    updateUIState();
    showToast('Optimization complete! Schedule generated.', 'success');
}

function generateMockSchedule() {
    // Generate dummy sessions for the week view
    // Week view is Mon-Fri, 8:00 - 18:00
    // Time format: "DAY_HH:MM"
    
    AppState.scheduleData = [
        { id: 1, title: 'CS101', type: 'lecture', instructor: 'Dr. Smith', room: 'R101', students: 45, day: 'MON', start: 9.0, duration: 1.5, locked: false },
        { id: 2, title: 'MATH201', type: 'lecture', instructor: 'Prof. Johnson', room: 'R102', students: 30, day: 'TUE', start: 11.0, duration: 1.0, locked: false },
        { id: 3, title: 'PHYS301', type: 'lab', instructor: 'Dr. Brown', room: 'LAB101', students: 20, day: 'WED', start: 14.0, duration: 2.0, locked: true },
        { id: 4, title: 'CS102', type: 'lecture', instructor: 'Dr. Smith', room: 'R101', students: 35, day: 'THU', start: 10.0, duration: 1.25, locked: false },
        { id: 5, title: 'MATH202', type: 'lecture', instructor: 'Prof. Wilson', room: 'R202', students: 25, day: 'FRI', start: 9.0, duration: 1.5, locked: false },
        // A conflict
        { id: 6, title: 'CS101 (Lab)', type: 'lab', instructor: 'Dr. Smith', room: 'R101', students: 20, day: 'MON', start: 9.0, duration: 1.0, locked: false, conflict: true }
    ];
    
    // Detect Conflicts (Simple Check)
    detectConflicts();
    
    // Initial Push to History
    pushHistory('Initial Generation');
    
    renderCalendarEvents();
}

// --- Calendar Grid & Events ---

function initCalendarGrid() {
    const gridContainer = document.getElementById('schedule-grid');
    if (!gridContainer) return;
    
    gridContainer.innerHTML = '';

    // Headers
    const days = ['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    days.forEach(day => {
        const header = document.createElement('div');
        header.className = 'timetable-header';
        header.textContent = day;
        gridContainer.appendChild(header);
    });

    // Columns
    // Time Column
    const timeCol = document.createElement('div');
    timeCol.className = 'time-column';
    for (let i = 8; i < 18; i++) {
        // Hour slot
        const slot = document.createElement('div');
        slot.className = 'time-slot-label';
        slot.textContent = `${i}:00`;
        timeCol.appendChild(slot);

        // Half hour slot
        const halfSlot = document.createElement('div');
        halfSlot.className = 'time-slot-label';
        halfSlot.style.borderBottom = '1px solid var(--color-border)'; // solid line for hour
        halfSlot.textContent = ``;
        timeCol.appendChild(halfSlot);
    }
    gridContainer.appendChild(timeCol);

    // Day Columns
    const dayKeys = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
    dayKeys.forEach(dayKey => {
        const col = document.createElement('div');
        col.className = 'day-column';
        col.dataset.day = dayKey;
        
        // Grid lines background
        const gridLines = document.createElement('div');
        gridLines.className = 'grid-lines';
        for (let i = 0; i < 20; i++) { // 10 hours * 2 slots
            const line = document.createElement('div');
            line.className = 'grid-line';
            gridLines.appendChild(line);
        }
        col.appendChild(gridLines);

        // Drop handlers
        col.addEventListener('dragover', handleDragOver);
        col.addEventListener('drop', handleDrop);

        gridContainer.appendChild(col);
    });
}

function renderCalendarEvents() {
    // Clear existing events
    document.querySelectorAll('.event-block').forEach(el => el.remove());
    
    const dayCols = {
        'MON': document.querySelector('.day-column[data-day="MON"]'),
        'TUE': document.querySelector('.day-column[data-day="TUE"]'),
        'WED': document.querySelector('.day-column[data-day="WED"]'),
        'THU': document.querySelector('.day-column[data-day="THU"]'),
        'FRI': document.querySelector('.day-column[data-day="FRI"]'),
    };
    
    AppState.scheduleData.forEach(session => {
        const col = dayCols[session.day];
        if (!col) return;

        const el = createEventElement(session);
        col.appendChild(el);
    });
}

function createEventElement(session) {
    const el = document.createElement('div');
    el.className = 'event-block';
    if (session.conflict) el.classList.add('conflict');
    if (session.locked) el.style.borderLeft = '3px solid var(--color-text-secondary)';
    
    // Positioning
    // 8:00 is start. Each hour is 80px (40px * 2 slots)
    const startOffset = (session.start - 8) * 80;
    const height = session.duration * 80;
    
    el.style.top = `${startOffset}px`;
    el.style.height = `${height}px`;
    el.draggable = !session.locked;
    el.dataset.id = session.id;
    
    // Content
    el.innerHTML = `
        <div class="event-grip"></div>
        <div class="event-content">
            <div class="event-title">${session.title}</div>
            <div class="event-meta">
                <span>${session.room}</span>
                <span>•</span>
                <span>${session.instructor}</span>
            </div>
        </div>
        <div class="event-pill">${session.students}</div>
    `;
    
    // Tooltip
    el.title = `${session.title}\nInstructor: ${session.instructor}\nRoom: ${session.room}\nStudents: ${session.students}`;
    
    // Event Listeners
    el.addEventListener('dragstart', handleDragStart);
    el.addEventListener('click', (e) => {
        e.stopPropagation();
        selectEvent(session.id);
    });
    
    return el;
}

// --- Drag & Drop & Validation ---

function handleDragStart(e) {
    if (e.target.classList.contains('locked')) {
        e.preventDefault();
        return;
    }
    
    AppState.draggedEventId = parseInt(e.currentTarget.dataset.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', AppState.draggedEventId);
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Snap Logic / Live Validation could go here
    // Calculate nearest slot
    const col = e.currentTarget;
    const rect = col.getBoundingClientRect();
    const offsetY = e.clientY - rect.top + col.scrollTop;
    
    // Could highlight slot here...
}

function handleDrop(e) {
    e.preventDefault();
    const col = e.currentTarget;
    const day = col.dataset.day;
    
    // Calculate new start time
    const rect = col.getBoundingClientRect();
    const offsetY = e.clientY - rect.top + col.scrollTop;
    const slotIndex = Math.floor(offsetY / 40);
    
    // 8:00 start + (index * 0.5 hours)
    let newStart = 8 + (slotIndex * 0.5);
    newStart = Math.max(8, Math.min(17, newStart)); // Clamp
    
    // Check if dropping a constraint chip
    const chipDataRaw = e.dataTransfer.getData('application/json');
    if (chipDataRaw) {
        try {
            const chipData = JSON.parse(chipDataRaw);
            if (chipData.type === 'chip') {
                showToast(`Constraint: ${chipData.text} applied to ${day} ${formatTime(newStart)}`, 'success');
                // Constraint logic would go here
                return;
            }
        } catch(err) { /* Ignore non-JSON drag data */ }
    }
    
    const eventId = AppState.draggedEventId;
    const session = AppState.scheduleData.find(s => s.id === eventId);
    
    if (session && !session.locked) {
        // Update Session
        session.day = day;
        session.start = newStart;
        
        // Recalculate Conflicts
        detectConflicts();
        
        // Re-render
        renderCalendarEvents();
        
        // Record History
        pushHistory(`Moved ${session.title} to ${day} ${formatTime(newStart)}`);
        
        showToast(`Moved to ${day} ${formatTime(newStart)}`, 'success');
    }

    AppState.draggedEventId = null;
}

function detectConflicts() {
    let conflicts = 0;
    // Reset
    AppState.scheduleData.forEach(s => s.conflict = false);
    
    // N^2 check (simple)
    for (let i = 0; i < AppState.scheduleData.length; i++) {
        for (let j = i + 1; j < AppState.scheduleData.length; j++) {
            const s1 = AppState.scheduleData[i];
            const s2 = AppState.scheduleData[j];
            
            if (s1.day === s2.day) {
                // Overlap check
                if (s1.start < s2.start + s2.duration && s2.start < s1.start + s1.duration) {
                    // Check resources
                    if (s1.room === s2.room || s1.instructor === s2.instructor) {
                        s1.conflict = true;
                        s2.conflict = true;
                        conflicts++;
                    }
                }
            }
        }
    }

    AppState.currentMetrics.hardConflicts = conflicts;
    updateUIState();
}

// --- Undo / History ---

function pushHistory(action) {
    // Remove future history if we were in the middle
    if (AppState.historyIndex < AppState.history.length - 1) {
        AppState.history = AppState.history.slice(0, AppState.historyIndex + 1);
    }
    
    // Clone Data
    const snapshot = JSON.parse(JSON.stringify(AppState.scheduleData));
    AppState.history.push({ action, data: snapshot });
    AppState.historyIndex++;
    
    updateUIState();
}

function undoAction() {
    if (AppState.historyIndex > 0) {
        AppState.historyIndex--;
        const state = AppState.history[AppState.historyIndex];
        AppState.scheduleData = JSON.parse(JSON.stringify(state.data));
        
        renderCalendarEvents();
        updateUIState();
        showToast(`Undid: ${AppState.history[AppState.historyIndex + 1].action}`, 'info');
    } else if (AppState.historyIndex === 0) {
        // Initial state
        const state = AppState.history[0];
        AppState.scheduleData = JSON.parse(JSON.stringify(state.data));
        // Keep at 0
        renderCalendarEvents();
        updateUIState();
    }
}

// --- Inspector ---

function selectEvent(id) {
    AppState.selectedEventId = id;
    const session = AppState.scheduleData.find(s => s.id === id);
    if (!session) return;
    
    const inspector = document.getElementById('inspector-content');
    inspector.classList.add('hidden');
    
    const template = document.getElementById('inspector-template');
    template.classList.remove('hidden');
    
    // Populate
    document.getElementById('inspect-course-name').textContent = session.title;
    document.getElementById('inspect-session-id').textContent = `Session ID: ${session.id}`;
    
    document.getElementById('inspect-instructor').textContent = session.instructor;
    document.getElementById('inspect-room').textContent = session.room;
    
    // Alerts
    const alerts = document.getElementById('inspect-alerts');
    alerts.innerHTML = '';
    if (session.conflict) {
        const alert = document.createElement('div');
        alert.className = 'toast error';
        alert.style.position = 'static';
        alert.style.marginBottom = '8px';
        alert.textContent = 'Conflict detected: Resource overlap';
        alerts.appendChild(alert);
    }
    
    // Lock Button
    const lockBtn = document.getElementById('inspect-lock-btn');
    lockBtn.textContent = session.locked ? '🔓 Unlock Session' : '🔒 Lock Session';
    lockBtn.onclick = () => {
        session.locked = !session.locked;
        pushHistory(`${session.locked ? 'Locked' : 'Unlocked'} ${session.title}`);
        renderCalendarEvents();
        selectEvent(id); // Refresh
    };
}

// --- Utils ---

function formatTime(decimalTime) {
    const hours = Math.floor(decimalTime);
    const minutes = (decimalTime - hours) * 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showLoading(msg) {
    document.getElementById('loading-modal').classList.remove('hidden');
    document.getElementById('loading-message').textContent = msg;
}

function hideLoading() {
    document.getElementById('loading-modal').classList.add('hidden');
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Undo
        if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            undoAction();
        }
        
        // Run Optimizer (R)
        if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
            if (!AppState.optimizationRunning && AppState.dataLoaded) {
                runOptimizer();
                showToast('Optimizer started via shortcut', 'info');
            }
        }
    });
}
