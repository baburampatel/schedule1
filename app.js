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

    // UI State
    theme: localStorage.getItem('theme') || 'light',
    compactMode: false,
    filter: 'all', // all, lectures, labs
    searchQuery: '', // Text search for calendar
    sidebarSearch: '', // Text search for sidebar constraints
    
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
    initTheme();
    initCalendarGrid();
    initKeyboardShortcuts();
    loadWorkspace(); // Try to load previous state
    updateUIState();
});

function initUI() {
    // Data Loading
    document.getElementById('load-sample-data').addEventListener('click', loadSampleData);
    
    // File Upload Handlers
    ['courses', 'instructors', 'rooms'].forEach(type => {
        const fileInput = document.getElementById(`${type}-file`);
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    const fileName = e.target.files[0].name;
                    const status = document.getElementById(`${type}-status`);
                    if (status) {
                        status.textContent = `Uploaded: ${fileName}`;
                        status.style.color = 'var(--color-success)';
                    }
                    showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} file uploaded`, 'success');
                    
                    // Simple check if all uploaded
                    const allUploaded = ['courses', 'instructors', 'rooms'].every(t => {
                        const el = document.getElementById(`${t}-file`);
                        return el && el.files.length > 0;
                    });
                    
                    if (allUploaded) {
                        AppState.dataLoaded = true;
                        updateUIState();
                    }
                }
            });
        }
    });
    
    // Optimizer Controls
    document.getElementById('toggle-config').addEventListener('click', () => {
        const panel = document.getElementById('config-panel');
        panel.classList.toggle('hidden');
    });
    
    document.getElementById('start-optimization').addEventListener('click', runOptimizer);
    document.getElementById('stop-optimization').addEventListener('click', stopOptimizer);
    document.getElementById('undo-btn').addEventListener('click', undoAction);
    document.getElementById('redo-btn').addEventListener('click', redoAction);

    // Inputs
    document.getElementById('generations').addEventListener('input', (e) => {
        document.getElementById('generations-val').textContent = e.target.value;
    });
    document.getElementById('mutation-rate').addEventListener('input', (e) => {
        document.getElementById('mutation-rate-value').textContent = e.target.value;
    });
    
    // Exports
    document.getElementById('export-csv').addEventListener('click', () => openExportPreview('CSV'));
    document.getElementById('export-json').addEventListener('click', () => openExportPreview('JSON'));
    document.getElementById('confirm-export-btn').addEventListener('click', confirmExport);
    
    // New Feature Controls
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('compact-toggle').addEventListener('click', toggleCompactMode);
    document.getElementById('shortcuts-help-btn').addEventListener('click', () => {
        document.getElementById('shortcuts-modal').classList.add('active');
    });

    // Filters
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            AppState.filter = e.target.dataset.filter;
            renderCalendarEvents();
        });
    });

    // Search Inputs
    document.getElementById('sidebar-search').addEventListener('input', (e) => {
        AppState.sidebarSearch = e.target.value.toLowerCase();
        renderConstraintChips();
    });

    document.getElementById('schedule-search').addEventListener('input', (e) => {
        AppState.searchQuery = e.target.value.toLowerCase();
        renderCalendarEvents();
    });
}

// --- Theme & UI Logic ---

function initTheme() {
    document.documentElement.dataset.theme = AppState.theme;
    updateThemeIcon();
}

function toggleTheme() {
    AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = AppState.theme;
    localStorage.setItem('theme', AppState.theme);
    updateThemeIcon();

    // Update charts if they exist
    if (window.roomChart) {
        updateChartTheme(window.roomChart);
    }
}

function updateThemeIcon() {
    const btn = document.getElementById('theme-toggle');
    btn.textContent = AppState.theme === 'light' ? '🌙' : '☀️';
}

function toggleCompactMode() {
    AppState.compactMode = !AppState.compactMode;
    document.body.dataset.compact = AppState.compactMode;
    const btn = document.getElementById('compact-toggle');
    btn.style.color = AppState.compactMode ? 'var(--color-primary)' : 'inherit';
}

function updateUIState() {
    // Update data summary
    const summary = document.getElementById('data-summary');
    if (AppState.dataLoaded) {
        summary.classList.remove('hidden');
        document.getElementById('start-optimization').disabled = false;
        document.getElementById('quick-filters').classList.remove('hidden');

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
    
    // Update undo/redo buttons
    document.getElementById('undo-btn').disabled = AppState.historyIndex <= 0;
    document.getElementById('redo-btn').disabled = AppState.historyIndex >= AppState.history.length - 1;
}

// --- Data & Optimization ---

function saveWorkspace() {
    const stateToSave = {
        scheduleData: AppState.scheduleData,
        dataLoaded: AppState.dataLoaded,
        scheduleGenerated: AppState.scheduleGenerated,
        currentMetrics: AppState.currentMetrics,
        config: AppState.config
    };
    localStorage.setItem('scheduler_workspace', JSON.stringify(stateToSave));
}

function loadWorkspace() {
    const saved = localStorage.getItem('scheduler_workspace');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            AppState.scheduleData = parsed.scheduleData || [];
            AppState.dataLoaded = parsed.dataLoaded || false;
            AppState.scheduleGenerated = parsed.scheduleGenerated || false;
            AppState.currentMetrics = parsed.currentMetrics || AppState.currentMetrics;
            AppState.config = parsed.config || AppState.config;
            
            if (AppState.dataLoaded) {
                renderConstraintChips();
            }
            if (AppState.scheduleGenerated) {
                renderCalendarEvents();
                initChart();
            }
            showToast('Workspace restored', 'info');
        } catch (e) {
            console.error('Failed to load workspace', e);
        }
    }
}

function loadSampleData() {
    showLoading('Loading data...');
    setTimeout(() => {
        AppState.dataLoaded = true;
        hideLoading();
        updateUIState();
        showToast('Sample data loaded successfully', 'success');
        renderConstraintChips();
        saveWorkspace();
    }, 800);
}

function renderConstraintChips() {
    const chipContainer = document.getElementById('constraint-chips');
    chipContainer.innerHTML = '';
    
    let chips = [
        { type: 'instructor', text: 'Dr. Smith', id: 'I001' },
        { type: 'room', text: 'R101', id: 'R101' },
        { type: 'course', text: 'CS101', id: 'C001' },
        { type: 'instructor', text: 'Prof. Johnson', id: 'I002' },
        { type: 'room', text: 'LAB101', id: 'L101' }
    ];

    if (AppState.sidebarSearch) {
        chips = chips.filter(c => c.text.toLowerCase().includes(AppState.sidebarSearch));
    }

    chips.forEach(chip => {
        const el = document.createElement('div');
        el.className = `chip chip-${chip.type}`;
        el.textContent = chip.text;
        el.draggable = true;
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
    }, 100); // Slightly faster for demo
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
    
    // Init chart
    initChart();
    saveWorkspace();
}

function generateMockSchedule() {
    AppState.scheduleData = [
        { id: 1, title: 'CS101', type: 'lecture', instructor: 'Dr. Smith', room: 'R101', students: 45, day: 'MON', start: 9.0, duration: 1.5, locked: false },
        { id: 2, title: 'MATH201', type: 'lecture', instructor: 'Prof. Johnson', room: 'R102', students: 30, day: 'TUE', start: 11.0, duration: 1.0, locked: false },
        { id: 3, title: 'PHYS301', type: 'lab', instructor: 'Dr. Brown', room: 'LAB101', students: 20, day: 'WED', start: 14.0, duration: 2.0, locked: true },
        { id: 4, title: 'CS102', type: 'lecture', instructor: 'Dr. Smith', room: 'R101', students: 35, day: 'THU', start: 10.0, duration: 1.25, locked: false },
        { id: 5, title: 'MATH202', type: 'lecture', instructor: 'Prof. Wilson', room: 'R202', students: 25, day: 'FRI', start: 9.0, duration: 1.5, locked: false },
        { id: 6, title: 'CS101 (Lab)', type: 'lab', instructor: 'Dr. Smith', room: 'R101', students: 20, day: 'MON', start: 9.0, duration: 1.0, locked: false, conflict: true }
    ];
    
    detectConflicts();
    pushHistory('Initial Generation');
    renderCalendarEvents();
}

// --- Calendar Grid & Events ---

function initCalendarGrid() {
    const gridContainer = document.getElementById('schedule-grid');
    if (!gridContainer) return;
    
    gridContainer.innerHTML = '';
    
    const days = ['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    days.forEach(day => {
        const header = document.createElement('div');
        header.className = 'timetable-header';
        header.textContent = day;
        gridContainer.appendChild(header);
    });
    
    const timeCol = document.createElement('div');
    timeCol.className = 'time-column';
    for (let i = 8; i < 18; i++) {
        const slot = document.createElement('div');
        slot.className = 'time-slot-label';
        slot.textContent = `${i}:00`;
        timeCol.appendChild(slot);
        
        const halfSlot = document.createElement('div');
        halfSlot.className = 'time-slot-label';
        halfSlot.style.borderBottom = '1px solid var(--color-border)';
        halfSlot.textContent = ``;
        timeCol.appendChild(halfSlot);
    }
    gridContainer.appendChild(timeCol);
    
    const dayKeys = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
    dayKeys.forEach(dayKey => {
        const col = document.createElement('div');
        col.className = 'day-column';
        col.dataset.day = dayKey;

        const gridLines = document.createElement('div');
        gridLines.className = 'grid-lines';
        for (let i = 0; i < 20; i++) {
            const line = document.createElement('div');
            line.className = 'grid-line';
            gridLines.appendChild(line);
        }
        col.appendChild(gridLines);
        
        col.addEventListener('dragover', handleDragOver);
        col.addEventListener('drop', handleDrop);

        gridContainer.appendChild(col);
    });
}

function renderCalendarEvents() {
    document.querySelectorAll('.event-block').forEach(el => el.remove());

    const dayCols = {
        'MON': document.querySelector('.day-column[data-day="MON"]'),
        'TUE': document.querySelector('.day-column[data-day="TUE"]'),
        'WED': document.querySelector('.day-column[data-day="WED"]'),
        'THU': document.querySelector('.day-column[data-day="THU"]'),
        'FRI': document.querySelector('.day-column[data-day="FRI"]'),
    };
    
    AppState.scheduleData.forEach(session => {
        // Type Filter
        if (AppState.filter !== 'all') {
            if (AppState.filter === 'lectures' && session.type !== 'lecture') return;
            if (AppState.filter === 'labs' && session.type !== 'lab') return;
        }

        // Text Search Filter
        if (AppState.searchQuery) {
            const query = AppState.searchQuery;
            const match = session.title.toLowerCase().includes(query) ||
                          session.instructor.toLowerCase().includes(query) ||
                          session.room.toLowerCase().includes(query);
            if (!match) return;
        }

        const col = dayCols[session.day];
        if (!col) return;

        const el = createEventElement(session);
        col.appendChild(el);
    });
}

function createEventElement(session) {
    const el = document.createElement('div');
    el.className = 'event-block';
    if (session.conflict) {
        el.classList.add('conflict');
        const badge = document.createElement('div');
        badge.className = 'conflict-badge';
        el.appendChild(badge);
    }
    if (session.locked) el.style.borderLeft = '3px solid var(--color-text-muted)';
    
    const startOffset = (session.start - 8) * 80;
    const height = session.duration * 80;
    
    el.style.top = `${startOffset}px`;
    el.style.height = `${height}px`;
    el.draggable = !session.locked;
    el.dataset.id = session.id;
    
    el.innerHTML += `
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

    el.title = `${session.title}\nInstructor: ${session.instructor}\nRoom: ${session.room}\nStudents: ${session.students}`;

    el.addEventListener('dragstart', handleDragStart);
    el.addEventListener('click', (e) => {
        e.stopPropagation();
        selectEvent(session.id);
    });
    
    return el;
}

// --- Drag & Drop ---

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
}

function refreshScheduleViews() {
    renderCalendarEvents();
    detectConflicts();
    updateUIState();
    initChart(); // Update Room Heatmap
    saveWorkspace();
}

function handleDrop(e) {
    e.preventDefault();
    const col = e.currentTarget;
    const day = col.dataset.day;
    
    const rect = col.getBoundingClientRect();
    const offsetY = e.clientY - rect.top + col.scrollTop;
    const slotIndex = Math.floor(offsetY / 40);

    let newStart = 8 + (slotIndex * 0.5);
    newStart = Math.max(8, Math.min(17, newStart));

    // Constraint Chip Logic
    const chipDataRaw = e.dataTransfer.getData('application/json');
    if (chipDataRaw) {
        try {
            const chipData = JSON.parse(chipDataRaw);
            if (chipData.type === 'chip') {
                showConstraintAppliedFeedback(chipData.text, day, newStart);
                return;
            }
        } catch(err) {}
    }

    const eventId = AppState.draggedEventId;
    const session = AppState.scheduleData.find(s => s.id === eventId);

    if (session && !session.locked) {
        session.day = day;
        session.start = newStart;
        
        // Record History before refresh (which saves workspace)
        pushHistory(`Moved ${session.title} to ${day} ${formatTime(newStart)}`);
        
        refreshScheduleViews();
        showToast(`Moved to ${day} ${formatTime(newStart)}`, 'success');
        
        // If selected, update inspector
        if (AppState.selectedEventId === session.id) {
            selectEvent(session.id);
        }
    }

    AppState.draggedEventId = null;
}

function detectConflicts() {
    let conflicts = 0;
    AppState.scheduleData.forEach(s => s.conflict = false);
    
    for (let i = 0; i < AppState.scheduleData.length; i++) {
        for (let j = i + 1; j < AppState.scheduleData.length; j++) {
            const s1 = AppState.scheduleData[i];
            const s2 = AppState.scheduleData[j];
            
            if (s1.day === s2.day) {
                if (s1.start < s2.start + s2.duration && s2.start < s1.start + s1.duration) {
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
    if (AppState.historyIndex < AppState.history.length - 1) {
        AppState.history = AppState.history.slice(0, AppState.historyIndex + 1);
    }
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
        refreshScheduleViews();
        showToast(`Undid: ${AppState.history[AppState.historyIndex + 1].action}`, 'info');
    }
}

function redoAction() {
    if (AppState.historyIndex < AppState.history.length - 1) {
        AppState.historyIndex++;
        const state = AppState.history[AppState.historyIndex];
        AppState.scheduleData = JSON.parse(JSON.stringify(state.data));
        refreshScheduleViews();
        showToast(`Redid: ${state.action}`, 'info');
    }
}

// --- Export Preview ---

let pendingExportFormat = '';

function openExportPreview(format) {
    if (!AppState.scheduleGenerated) {
        showToast('No schedule to export', 'error');
        return;
    }
    pendingExportFormat = format;
    const modal = document.getElementById('export-modal');
    const content = document.getElementById('export-preview-content');
    
    let previewText = `Export Format: ${format}\n\n`;
    previewText += `Total Sessions: ${AppState.scheduleData.length}\n`;
    previewText += `Conflicts: ${AppState.currentMetrics.hardConflicts}\n\n`;
    previewText += `Sample Data:\n`;
    
    AppState.scheduleData.slice(0, 3).forEach(s => {
        previewText += `- ${s.title}: ${s.day} ${formatTime(s.start)} (${s.room})\n`;
    });

    content.textContent = previewText;
    modal.classList.add('active');
}

function confirmExport() {
    document.getElementById('export-modal').classList.remove('active');
    showToast(`Exporting ${pendingExportFormat}...`, 'success');
}

// --- Inspector ---

function selectEvent(id) {
    AppState.selectedEventId = id;
    const session = AppState.scheduleData.find(s => s.id === id);
    if (!session) return;
    
    document.getElementById('inspector-content').classList.add('hidden');
    document.getElementById('inspector-template').classList.remove('hidden');
    
    document.getElementById('inspect-course-name').textContent = session.title;
    document.getElementById('inspect-session-id').textContent = `Session ID: ${session.id}`;
    document.getElementById('inspect-instructor').textContent = session.instructor;
    document.getElementById('inspect-room').textContent = session.room;
    
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

    const lockBtn = document.getElementById('inspect-lock-btn');
    lockBtn.textContent = session.locked ? '🔓 Unlock Session' : '🔒 Lock Session';
    lockBtn.onclick = () => {
        session.locked = !session.locked;
        pushHistory(`${session.locked ? 'Locked' : 'Unlocked'} ${session.title}`);
        renderCalendarEvents();
        selectEvent(id);
    };
}

// --- Charts ---

function initChart() {
    const ctx = document.getElementById('room-chart');
    if (!ctx) return;
    
    if (window.roomChart) window.roomChart.destroy();
    
    const isDark = AppState.theme === 'dark';
    const textColor = isDark ? '#cbd5e1' : '#374151';
    
    window.roomChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Occupied', 'Free'],
            datasets: [{
                data: [65, 35],
                backgroundColor: ['#06b6d4', '#e2e8f0'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: textColor, boxWidth: 10 }
                }
            }
        }
    });
}

function updateChartTheme(chart) {
    const isDark = AppState.theme === 'dark';
    const textColor = isDark ? '#cbd5e1' : '#374151';
    const bgColor = isDark ? '#334155' : '#e2e8f0';
    
    chart.data.datasets[0].backgroundColor[1] = bgColor;
    chart.options.plugins.legend.labels.color = textColor;
    chart.update();
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

function showConstraintAppliedFeedback(text, day, time) {
    // Simulate a "Constraint Applied" modal or enhanced toast
    const message = `Constraint applied: ${text} must be at ${day} ${formatTime(time)}`;
    
    // Create a custom toast with an "Apply" action simulation
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:4px;">
            <strong>Constraint Detected</strong>
            <span>${message}</span>
        </div>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
    
    // Also update inspector to show this
    const inspectorContent = document.getElementById('inspector-content');
    if (inspectorContent) {
        inspectorContent.classList.remove('hidden');
        inspectorContent.innerHTML = `
            <div class="card">
                <div class="card-header">New Constraint</div>
                <div class="card-body">
                    <p><strong>${text}</strong></p>
                    <p>Fixed to: ${day} ${formatTime(time)}</p>
                    <button class="btn btn-primary btn-sm" style="width:100%" onclick="showToast('Constraint saved to rules engine', 'success')">Apply Rule</button>
                </div>
            </div>
        `;
    }
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'z') {
            e.preventDefault();
            undoAction();
        }
        if (e.ctrlKey && e.key.toLowerCase() === 'y') {
            e.preventDefault();
            redoAction();
        }
        if (e.key.toLowerCase() === 'r' && !e.ctrlKey) {
            if (!AppState.optimizationRunning && AppState.dataLoaded) runOptimizer();
        }
        if (e.key.toLowerCase() === 'c' && !e.ctrlKey) {
            toggleCompactMode();
        }
    });
}
