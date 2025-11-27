// Application State
const AppState = {
    currentTab: 'upload',
    dataLoaded: false,
    scheduleGenerated: false,
    optimizationRunning: false,
    editHistory: [],
    editIndex: -1,
    draggedElement: null,
    draggedData: null,
    
    // Sample data from JSON
    sampleData: {
        courses: [
            {"course_id": "CS101", "course_name": "Intro to Programming", "num_sessions": 3, "session_length_minutes": 90, "required_equipment": "computers,projector", "student_group_ids": "G1,G2", "enrollment_count": 45, "preferred_time_slots": "MON_09_10:30,WED_09_10:30,FRI_09_10:30"},
            {"course_id": "CS102", "course_name": "Data Structures", "num_sessions": 4, "session_length_minutes": 75, "required_equipment": "computers,projector,whiteboard", "student_group_ids": "G2,G3", "enrollment_count": 35, "preferred_time_slots": "TUE_10_11:15,THU_10_11:15"},
            {"course_id": "MATH201", "course_name": "Calculus II", "num_sessions": 4, "session_length_minutes": 60, "required_equipment": "whiteboard", "student_group_ids": "G1,G4", "enrollment_count": 30, "preferred_time_slots": "TUE_11_12,THU_11_12"},
            {"course_id": "MATH202", "course_name": "Linear Algebra", "num_sessions": 3, "session_length_minutes": 90, "required_equipment": "whiteboard,projector", "student_group_ids": "G2,G4", "enrollment_count": 25, "preferred_time_slots": "MON_14_15:30,WED_14_15:30"},
            {"course_id": "PHYS301", "course_name": "Quantum Physics", "num_sessions": 2, "session_length_minutes": 120, "required_equipment": "lab_equipment,projector", "student_group_ids": "G3", "enrollment_count": 20, "preferred_time_slots": "MON_15_17,WED_15_17"},
            {"course_id": "PHYS302", "course_name": "Thermodynamics", "num_sessions": 3, "session_length_minutes": 90, "required_equipment": "lab_equipment,whiteboard", "student_group_ids": "G3,G4", "enrollment_count": 22, "preferred_time_slots": "TUE_14_15:30,THU_14_15:30,FRI_14_15:30"}
        ],
        instructors: [
            {"instructor_id": "I001", "name": "Dr. Smith", "max_load_sessions_per_week": 12, "available_time_slots": "MON_08_18,TUE_08_18,WED_08_18,THU_08_18,FRI_08_18", "preferred_rooms": "R101,R102"},
            {"instructor_id": "I002", "name": "Prof. Johnson", "max_load_sessions_per_week": 10, "available_time_slots": "TUE_10_16,THU_10_16,FRI_09_15", "preferred_rooms": "R201,R202"},
            {"instructor_id": "I003", "name": "Dr. Brown", "max_load_sessions_per_week": 8, "available_time_slots": "MON_13_17,WED_13_17,FRI_13_17", "preferred_rooms": "LAB101,LAB102"},
            {"instructor_id": "I004", "name": "Dr. Davis", "max_load_sessions_per_week": 15, "available_time_slots": "MON_09_17,TUE_09_17,WED_09_17,THU_09_17", "preferred_rooms": "R101,R201,LAB101"},
            {"instructor_id": "I005", "name": "Prof. Wilson", "max_load_sessions_per_week": 12, "available_time_slots": "TUE_08_16,WED_08_16,THU_08_16,FRI_08_16", "preferred_rooms": "R102,R202"}
        ],
        rooms: [
            {"room_id": "R101", "capacity": 50, "equipment": "computers,projector,whiteboard", "building": "Engineering", "available_time_slots": "MON_08_18,TUE_08_18,WED_08_18,THU_08_18,FRI_08_18"},
            {"room_id": "R102", "capacity": 40, "equipment": "projector,whiteboard", "building": "Engineering", "available_time_slots": "MON_08_18,TUE_08_18,WED_08_18,THU_08_18,FRI_08_18"},
            {"room_id": "R201", "capacity": 60, "equipment": "projector,whiteboard,audio_system", "building": "Science", "available_time_slots": "MON_09_17,TUE_09_17,WED_09_17,THU_09_17,FRI_09_17"},
            {"room_id": "R202", "capacity": 35, "equipment": "computers,projector", "building": "Science", "available_time_slots": "TUE_08_18,WED_08_18,THU_08_18,FRI_08_18"},
            {"room_id": "LAB101", "capacity": 25, "equipment": "lab_equipment,computers,projector", "building": "Science", "available_time_slots": "MON_09_17,WED_09_17,FRI_09_17"},
            {"room_id": "LAB102", "capacity": 30, "equipment": "lab_equipment,whiteboard,projector", "building": "Science", "available_time_slots": "TUE_09_17,THU_09_17,FRI_09_17"},
            {"room_id": "HALL001", "capacity": 100, "equipment": "projector,audio_system,whiteboard", "building": "Main", "available_time_slots": "MON_08_18,TUE_08_18,WED_08_18,THU_08_18,FRI_08_18"}
        ],
        studentGroups: [
            {"group_id": "G1", "name": "Computer Science Year 1", "courses_enrolled": "CS101,MATH201"},
            {"group_id": "G2", "name": "Computer Science Year 2", "courses_enrolled": "CS101,CS102,MATH202"},
            {"group_id": "G3", "name": "Physics Graduate", "courses_enrolled": "CS102,PHYS301,PHYS302"},
            {"group_id": "G4", "name": "Mathematics Year 2", "courses_enrolled": "MATH201,MATH202,PHYS302"}
        ]
    },
    
    // Current schedule data
    scheduleData: [],
    
    // Metrics
    currentMetrics: {
        hardConflicts: 2,
        softViolations: 5,
        fitness: 75.4,
        conflictDetails: {
            instructorConflicts: 1,
            roomConflicts: 1,
            studentConflicts: 0
        },
        violationDetails: {
            timeViolations: 3,
            instructorViolations: 2,
            loadViolations: 0
        }
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

// Utility Functions
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        ${message}
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    document.getElementById('toast-container').appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
    
    toast.addEventListener('click', () => {
        toast.remove();
    });
}

function showLoading(message = 'Processing...') {
    const modal = document.getElementById('loading-modal');
    const messageEl = document.getElementById('loading-message');
    messageEl.textContent = message;
    modal.classList.remove('hidden');
}

function hideLoading() {
    const modal = document.getElementById('loading-modal');
    modal.classList.add('hidden');
}

function updateTabState() {
    // Enable/disable tabs based on state
    const configTab = document.querySelector('[data-tab="configure"]');
    const schedulerTab = document.querySelector('[data-tab="scheduler"]');
    const visualizeTab = document.querySelector('[data-tab="visualize"]');
    const exportTab = document.querySelector('[data-tab="export"]');
    const editorTab = document.querySelector('[data-tab="editor"]');
    
    if (AppState.dataLoaded) {
        configTab.style.opacity = '1';
        schedulerTab.style.opacity = '1';
        const startBtn = document.getElementById('start-optimization');
        if (startBtn) startBtn.disabled = false;
    } else {
        configTab.style.opacity = '0.6';
        schedulerTab.style.opacity = '0.6';
        const startBtn = document.getElementById('start-optimization');
        if (startBtn) startBtn.disabled = true;
    }
    
    if (AppState.scheduleGenerated) {
        visualizeTab.style.opacity = '1';
        exportTab.style.opacity = '1';
        editorTab.style.opacity = '1';
    } else {
        visualizeTab.style.opacity = '0.6';
        exportTab.style.opacity = '0.6';
        editorTab.style.opacity = '0.6';
    }
}

// Fixed Tab Navigation
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = button.dataset.tab;
            
            // Clear drag feedback if it exists
            const dragFeedback = document.getElementById('drag-feedback');
            if (dragFeedback) {
                dragFeedback.classList.add('hidden');
            }
            
            // Update active states
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            button.classList.add('active');
            const targetTab = document.getElementById(`${tabName}-tab`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
            
            AppState.currentTab = tabName;
            
            // Tab-specific initialization
            if (tabName === 'visualize') {
                setTimeout(() => initCharts(), 100);
            } else if (tabName === 'export') {
                const exportSummary = document.getElementById('export-summary');
                if (exportSummary && AppState.scheduleGenerated) {
                    exportSummary.style.display = 'block';
                }
            }
        });
    });
}

// Upload Data Tab
function initUploadTab() {
    const loadSampleBtn = document.getElementById('load-sample-data');
    if (loadSampleBtn) {
        loadSampleBtn.addEventListener('click', () => {
            showLoading('Loading sample data...');
            
            setTimeout(() => {
                // Simulate loading sample data
                AppState.dataLoaded = true;
                
                // Update UI
                const dataSummary = document.getElementById('data-summary');
                if (dataSummary) {
                    dataSummary.style.display = 'block';
                }
                document.getElementById('courses-count').textContent = AppState.sampleData.courses.length;
                document.getElementById('instructors-count').textContent = AppState.sampleData.instructors.length;
                document.getElementById('rooms-count').textContent = AppState.sampleData.rooms.length;
                document.getElementById('groups-count').textContent = AppState.sampleData.studentGroups.length;
                
                // Update upload statuses
                ['courses', 'instructors', 'rooms', 'groups'].forEach(type => {
                    const status = document.getElementById(`${type}-status`);
                    if (status) {
                        status.textContent = 'Sample data loaded';
                        status.classList.add('uploaded');
                    }
                });
                
                hideLoading();
                updateTabState();
                showToast('Sample data loaded successfully! You can now configure optimization parameters.', 'success');
            }, 1500);
        });
    }
    
    // File upload handlers
    ['courses', 'instructors', 'rooms', 'groups'].forEach(type => {
        const fileInput = document.getElementById(`${type}-file`);
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    const fileName = e.target.files[0].name;
                    const status = document.getElementById(`${type}-status`);
                    if (status) {
                        status.textContent = `Uploaded: ${fileName}`;
                        status.classList.add('uploaded');
                    }
                    showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} file uploaded: ${fileName}`, 'success');
                    
                    // Check if all files are uploaded
                    const allUploaded = ['courses', 'instructors', 'rooms', 'groups'].every(t => {
                        const statusEl = document.getElementById(`${t}-status`);
                        return statusEl && statusEl.classList.contains('uploaded');
                    });
                    
                    if (allUploaded && !AppState.dataLoaded) {
                        AppState.dataLoaded = true;
                        updateTabState();
                        showToast('All data files uploaded! Ready for optimization.', 'success');
                    }
                }
            });
        }
    });
}

// Configure Tab
function initConfigureTab() {
    // Preset handling
    const presetSelect = document.getElementById('optimization-preset');
    if (presetSelect) {
        presetSelect.addEventListener('change', (e) => {
            const preset = e.target.value;
            let config = {};
            
            switch (preset) {
                case 'fast':
                    config = {
                        populationSize: 50,
                        generations: 100,
                        mutationRate: 0.2,
                        crossoverRate: 0.7,
                        maxRuntime: 5
                    };
                    break;
                case 'optimal':
                    config = {
                        populationSize: 200,
                        generations: 500,
                        mutationRate: 0.1,
                        crossoverRate: 0.9,
                        maxRuntime: 30
                    };
                    break;
                default: // balanced
                    config = {
                        populationSize: 100,
                        generations: 200,
                        mutationRate: 0.15,
                        crossoverRate: 0.8,
                        maxRuntime: 10
                    };
            }
            
            Object.assign(AppState.config, config);
            updateConfigUI();
            showToast(`Applied ${preset} preset configuration`, 'info');
        });
    }
    
    // Range input handlers
    ['mutation-rate', 'crossover-rate', 'hard-constraint-weight', 'soft-constraint-weight'].forEach(id => {
        const input = document.getElementById(id);
        const valueSpan = document.getElementById(`${id}-value`);
        
        if (input && valueSpan) {
            input.addEventListener('input', () => {
                valueSpan.textContent = input.value;
                const configKey = id.replace(/-([a-z])/g, (g) => g[1].toUpperCase()).replace('-', '');
                AppState.config[configKey] = parseFloat(input.value);
            });
        }
    });
    
    // Number input handlers
    ['population-size', 'generations', 'max-runtime', 'target-fitness'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('change', () => {
                const configKey = id.replace(/-([a-z])/g, (g) => g[1].toUpperCase()).replace('-', '');
                AppState.config[configKey] = parseFloat(input.value);
            });
        }
    });
    
    // Reset defaults
    const resetBtn = document.getElementById('reset-defaults');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            AppState.config = {
                populationSize: 100,
                generations: 200,
                mutationRate: 0.15,
                crossoverRate: 0.8,
                hardConstraintWeight: 10,
                softConstraintWeight: 1,
                maxRuntime: 10,
                targetFitness: 95
            };
            updateConfigUI();
            const presetSelect = document.getElementById('optimization-preset');
            if (presetSelect) presetSelect.value = 'balanced';
            showToast('Configuration reset to defaults', 'info');
        });
    }
    
    // Save configuration
    const saveBtn = document.getElementById('save-config');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            showToast('Configuration saved successfully', 'success');
        });
    }
}

function updateConfigUI() {
    const fields = [
        ['population-size', 'populationSize'],
        ['generations', 'generations'],
        ['mutation-rate', 'mutationRate'],
        ['crossover-rate', 'crossoverRate'],
        ['hard-constraint-weight', 'hardConstraintWeight'],
        ['soft-constraint-weight', 'softConstraintWeight'],
        ['max-runtime', 'maxRuntime'],
        ['target-fitness', 'targetFitness']
    ];
    
    fields.forEach(([elementId, configKey]) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.value = AppState.config[configKey];
            
            // Update value display for range inputs
            const valueElement = document.getElementById(`${elementId}-value`);
            if (valueElement) {
                valueElement.textContent = AppState.config[configKey];
            }
        }
    });
}

// Scheduler Tab
function initSchedulerTab() {
    const startBtn = document.getElementById('start-optimization');
    const stopBtn = document.getElementById('stop-optimization');
    const generateBtn = document.getElementById('generate-schedule-table');
    const viewDetailsBtn = document.getElementById('view-details');
    
    if (startBtn) startBtn.addEventListener('click', startOptimization);
    if (stopBtn) stopBtn.addEventListener('click', stopOptimization);
    if (generateBtn) generateBtn.addEventListener('click', generateScheduleTable);
    if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', () => {
            showToast('Detailed analysis would show optimization history and parameter sensitivity', 'info');
        });
    }
}

function startOptimization() {
    if (!AppState.dataLoaded) {
        showToast('Please upload data first', 'warning');
        return;
    }
    
    AppState.optimizationRunning = true;
    
    // Update UI
    const startBtn = document.getElementById('start-optimization');
    const stopBtn = document.getElementById('stop-optimization');
    const progressSection = document.getElementById('progress-section');
    const resultsSection = document.getElementById('results-section');
    
    if (startBtn) startBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = false;
    if (progressSection) progressSection.style.display = 'block';
    if (resultsSection) resultsSection.style.display = 'none';
    
    // Simulate optimization progress
    let generation = 0;
    let fitness = 45.2;
    let startTime = Date.now();
    
    const progressInterval = setInterval(() => {
        generation += Math.floor(Math.random() * 3) + 1;
        fitness += Math.random() * 2;
        
        if (generation >= AppState.config.generations || fitness >= AppState.config.targetFitness) {
            generation = AppState.config.generations;
            fitness = Math.min(fitness, 95.8);
            completeOptimization();
            clearInterval(progressInterval);
            return;
        }
        
        // Update progress UI
        const progress = (generation / AppState.config.generations) * 100;
        const progressFill = document.getElementById('progress-fill');
        const progressPercent = document.getElementById('progress-percent');
        const currentGeneration = document.getElementById('current-generation');
        const currentFitness = document.getElementById('current-fitness');
        const runtime = document.getElementById('runtime');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressPercent) progressPercent.textContent = `${Math.round(progress)}%`;
        if (currentGeneration) currentGeneration.textContent = generation;
        if (currentFitness) currentFitness.textContent = fitness.toFixed(1);
        
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        if (runtime) runtime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update status text
        if (progressText) {
            if (progress < 25) {
                progressText.textContent = 'Initializing population...';
            } else if (progress < 50) {
                progressText.textContent = 'Evolving solutions...';
            } else if (progress < 75) {
                progressText.textContent = 'Fine-tuning parameters...';
            } else {
                progressText.textContent = 'Finalizing best solution...';
            }
        }
    }, 200);
}

function stopOptimization() {
    AppState.optimizationRunning = false;
    const startBtn = document.getElementById('start-optimization');
    const stopBtn = document.getElementById('stop-optimization');
    const progressSection = document.getElementById('progress-section');
    
    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
    if (progressSection) progressSection.style.display = 'none';
    showToast('Optimization stopped by user', 'warning');
}

function completeOptimization() {
    AppState.optimizationRunning = false;
    AppState.scheduleGenerated = true;
    
    // Generate sample schedule data
    AppState.scheduleData = [
        {"id": "1", "course_id": "CS101", "course_name": "Intro to Programming", "session": 1, "room_id": "R101", "time_slot": "MON_09_10:30", "instructor_id": "I001", "instructor_name": "Dr. Smith", "student_groups": ["G1", "G2"], "locked": false},
        {"id": "2", "course_id": "CS101", "course_name": "Intro to Programming", "session": 2, "room_id": "R101", "time_slot": "WED_09_10:30", "instructor_id": "I001", "instructor_name": "Dr. Smith", "student_groups": ["G1", "G2"], "locked": false},
        {"id": "3", "course_id": "CS101", "course_name": "Intro to Programming", "session": 3, "room_id": "R101", "time_slot": "FRI_09_10:30", "instructor_id": "I001", "instructor_name": "Dr. Smith", "student_groups": ["G1", "G2"], "locked": false},
        {"id": "4", "course_id": "MATH201", "course_name": "Calculus II", "session": 1, "room_id": "R102", "time_slot": "TUE_11_12", "instructor_id": "I002", "instructor_name": "Prof. Johnson", "student_groups": ["G1", "G4"], "locked": false},
        {"id": "5", "course_id": "MATH201", "course_name": "Calculus II", "session": 2, "room_id": "R102", "time_slot": "THU_11_12", "instructor_id": "I002", "instructor_name": "Prof. Johnson", "student_groups": ["G1", "G4"], "locked": false},
        {"id": "6", "course_id": "PHYS301", "course_name": "Quantum Physics", "session": 1, "room_id": "LAB101", "time_slot": "MON_15_17", "instructor_id": "I003", "instructor_name": "Dr. Brown", "student_groups": ["G3"], "locked": false}
    ];
    
    // Update UI
    const startBtn = document.getElementById('start-optimization');
    const stopBtn = document.getElementById('stop-optimization');
    const progressSection = document.getElementById('progress-section');
    const resultsSection = document.getElementById('results-section');
    const generateBtn = document.getElementById('generate-schedule-table');
    
    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
    if (progressSection) progressSection.style.display = 'none';
    if (resultsSection) resultsSection.style.display = 'block';
    if (generateBtn) generateBtn.style.display = 'inline-flex';
    
    // Update metrics
    updateMetricsDisplay();
    updateTabState();
    showToast('Optimization completed successfully! Click "Generate Schedule Table" to view results.', 'success');
}

function generateScheduleTable() {
    showLoading('Generating schedule table...');
    
    setTimeout(() => {
        hideLoading();
        showToast('Schedule table generated! You can now view it in the Visualize tab or edit it manually in the Editor tab.', 'success');
        
        // Switch to visualize tab
        const visualizeTab = document.querySelector('[data-tab="visualize"]');
        if (visualizeTab) {
            visualizeTab.click();
        }
    }, 1000);
}

function updateMetricsDisplay() {
    const metrics = AppState.currentMetrics;
    
    // Update final metrics
    const finalElements = {
        'final-hard-conflicts': metrics.hardConflicts,
        'final-soft-violations': metrics.softViolations,
        'final-fitness-score': metrics.fitness,
        'optimization-status': 'Complete',
        'final-instructor-conflicts': metrics.conflictDetails.instructorConflicts,
        'final-room-conflicts': metrics.conflictDetails.roomConflicts,
        'final-student-conflicts': metrics.conflictDetails.studentConflicts,
        'final-time-violations': metrics.violationDetails.timeViolations,
        'final-instructor-violations': metrics.violationDetails.instructorViolations
    };
    
    Object.entries(finalElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
    
    // Update live editor metrics if visible
    const liveConflicts = document.getElementById('live-conflicts');
    const liveViolations = document.getElementById('live-violations');
    if (liveConflicts) liveConflicts.textContent = metrics.hardConflicts;
    if (liveViolations) liveViolations.textContent = metrics.softViolations;
    
    // Update export summary
    const exportElements = {
        'export-total-sessions': AppState.scheduleData.length,
        'export-hard-conflicts': metrics.hardConflicts,
        'export-soft-violations': metrics.softViolations,
        'export-fitness': metrics.fitness
    };
    
    Object.entries(exportElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

// Visualize Tab
function initVisualizeTab() {
    const viewTypeSelect = document.getElementById('view-type');
    const refreshBtn = document.getElementById('refresh-view');
    
    if (viewTypeSelect) {
        viewTypeSelect.addEventListener('change', (e) => {
            const viewType = e.target.value;
            switchView(viewType);
        });
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const currentView = viewTypeSelect ? viewTypeSelect.value : 'room';
            switchView(currentView);
            showToast('View refreshed with latest data', 'success');
        });
    }
}

function switchView(viewType) {
    // Hide all views
    document.querySelectorAll('.timetable-view').forEach(view => {
        view.style.display = 'none';
    });
    
    // Show selected view
    const targetView = document.getElementById(`${viewType}-view`);
    if (targetView) {
        targetView.style.display = 'block';
    }
}

function initCharts() {
    // Room Utilization Chart
    const roomCtx = document.getElementById('room-utilization-chart');
    if (roomCtx && typeof Chart !== 'undefined') {
        // Destroy existing chart if it exists
        if (roomCtx.chart) {
            roomCtx.chart.destroy();
        }
        
        roomCtx.chart = new Chart(roomCtx, {
            type: 'bar',
            data: {
                labels: ['R101', 'R102', 'R201', 'R202', 'LAB101', 'LAB102', 'HALL001'],
                datasets: [{
                    label: 'Hours per Week',
                    data: [7.5, 2, 0, 0, 4, 0, 0],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C'],
                    borderColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Room Utilization per Week'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Hours'
                        }
                    }
                }
            }
        });
    }
    
    // Instructor Workload Chart
    const instructorCtx = document.getElementById('instructor-workload-chart');
    if (instructorCtx && typeof Chart !== 'undefined') {
        // Destroy existing chart if it exists
        if (instructorCtx.chart) {
            instructorCtx.chart.destroy();
        }
        
        instructorCtx.chart = new Chart(instructorCtx, {
            type: 'doughnut',
            data: {
                labels: ['Dr. Smith', 'Prof. Johnson', 'Dr. Brown', 'Available'],
                datasets: [{
                    data: [4.5, 2, 4, 12.5],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
                    borderColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Instructor Weekly Workload Distribution'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Export Tab
function initExportTab() {
    const exportButtons = [
        ['export-csv', exportCSV],
        ['export-pdf', exportPDF],
        ['export-ics', exportICS],
        ['export-json', exportJSON]
    ];
    
    exportButtons.forEach(([id, handler]) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', handler);
        }
    });
}

function exportCSV() {
    const headers = ['Course ID', 'Course Name', 'Session', 'Room', 'Instructor', 'Time Slot', 'Student Groups'];
    let csvContent = headers.join(',') + '\n';
    
    AppState.scheduleData.forEach(session => {
        const row = [
            session.course_id,
            `"${session.course_name}"`,
            session.session,
            session.room_id,
            `"${session.instructor_name}"`,
            session.time_slot,
            `"${session.student_groups.join(', ')}"`
        ];
        csvContent += row.join(',') + '\n';
    });
    
    downloadFile(csvContent, 'schedule.csv', 'text/csv');
    showToast('Schedule exported as CSV', 'success');
}

function exportPDF() {
    showToast('PDF export would generate a comprehensive schedule report', 'info');
}

function exportICS() {
    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Academic Scheduler//EN\n';
    
    AppState.scheduleData.forEach(session => {
        const [day, timeRange] = session.time_slot.split('_');
        const [startTime, endTime] = timeRange.split('_');
        
        icsContent += 'BEGIN:VEVENT\n';
        icsContent += `SUMMARY:${session.course_name} - Session ${session.session}\n`;
        icsContent += `DESCRIPTION:Instructor: ${session.instructor_name}\\nRoom: ${session.room_id}\n`;
        icsContent += `LOCATION:${session.room_id}\n`;
        icsContent += 'END:VEVENT\n';
    });
    
    icsContent += 'END:VCALENDAR';
    downloadFile(icsContent, 'schedule.ics', 'text/calendar');
    showToast('Schedule exported as ICS calendar file', 'success');
}

function exportJSON() {
    const exportData = {
        schedule: AppState.scheduleData,
        metrics: AppState.currentMetrics,
        metadata: {
            exported_at: new Date().toISOString(),
            total_sessions: AppState.scheduleData.length
        }
    };
    
    const jsonContent = JSON.stringify(exportData, null, 2);
    downloadFile(jsonContent, 'schedule.json', 'application/json');
    showToast('Schedule exported as JSON', 'success');
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Editor Tab - Fixed Implementation
function initEditorTab() {
    const loadBtn = document.getElementById('load-sample-schedule');
    const undoBtn = document.getElementById('undo-edit');
    const resetBtn = document.getElementById('reset-schedule');
    
    if (loadBtn) loadBtn.addEventListener('click', loadSampleSchedule);
    if (undoBtn) undoBtn.addEventListener('click', undoEdit);
    if (resetBtn) resetBtn.addEventListener('click', resetSchedule);
}

function loadSampleSchedule() {
    showLoading('Loading sample schedule for editing...');
    
    setTimeout(() => {
        // Load the schedule data with conflicts
        AppState.scheduleData = [
            {"id": "1", "course_id": "CS101", "course_name": "Intro to Programming", "session": 1, "room_id": "R101", "time_slot": "MON_09_10:30", "instructor_id": "I001", "instructor_name": "Dr. Smith", "student_groups": ["G1", "G2"], "locked": false},
            {"id": "2", "course_id": "CS101", "course_name": "Intro to Programming", "session": 2, "room_id": "R101", "time_slot": "WED_09_10:30", "instructor_id": "I001", "instructor_name": "Dr. Smith", "student_groups": ["G1", "G2"], "locked": false},
            {"id": "3", "course_id": "MATH201", "course_name": "Calculus II", "session": 1, "room_id": "R102", "time_slot": "MON_09_10:30", "instructor_id": "I001", "instructor_name": "Dr. Smith", "student_groups": ["G1", "G4"], "locked": false},
            {"id": "4", "course_id": "MATH201", "course_name": "Calculus II", "session": 2, "room_id": "R102", "time_slot": "THU_11_12", "instructor_id": "I002", "instructor_name": "Prof. Johnson", "student_groups": ["G1", "G4"], "locked": false},
            {"id": "5", "course_id": "PHYS301", "course_name": "Quantum Physics", "session": 1, "room_id": "LAB101", "time_slot": "MON_15_17", "instructor_id": "I003", "instructor_name": "Dr. Brown", "student_groups": ["G3"], "locked": false},
            {"id": "6", "course_id": "PHYS301", "course_name": "Quantum Physics", "session": 2, "room_id": "R101", "time_slot": "WED_09_10:30", "instructor_id": "I003", "instructor_name": "Dr. Brown", "student_groups": ["G3"], "locked": false}
        ];
        
        buildScheduleGrid();
        updateMetricsDisplay();
        initDragAndDrop();
        
        const editorCard = document.getElementById('schedule-editor-card');
        const editStatus = document.getElementById('edit-status');
        
        if (editorCard) editorCard.style.display = 'block';
        if (editStatus) {
            editStatus.innerHTML = '<span class="status-indicator ready"></span><span class="status-text">Ready for editing - Drag sessions to different slots</span>';
        }
        
        hideLoading();
        showToast('Sample schedule loaded with conflicts for demonstration. Drag sessions to resolve conflicts!', 'success');
    }, 1000);
}

function buildScheduleGrid() {
    const grid = document.getElementById('schedule-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Create grid structure
    const timeSlots = ['MON_09_10:30', 'TUE_11_12', 'WED_09_10:30', 'THU_11_12', 'FRI_09_10:30', 'MON_15_17'];
    const rooms = ['R101', 'R102', 'R201', 'LAB101'];
    
    // Headers
    grid.appendChild(createGridElement('div', 'time-header', 'Time'));
    rooms.forEach(room => {
        grid.appendChild(createGridElement('div', 'room-header', room));
    });
    
    // Time slots and cells
    timeSlots.forEach(timeSlot => {
        const formattedTime = formatTimeSlot(timeSlot);
        grid.appendChild(createGridElement('div', 'time-slot-grid', formattedTime));
        
        rooms.forEach(room => {
            const cell = createGridElement('div', 'schedule-cell');
            cell.dataset.time = timeSlot;
            cell.dataset.room = room;
            
            // Find session for this cell
            const session = AppState.scheduleData.find(s => s.time_slot === timeSlot && s.room_id === room);
            if (session) {
                const sessionBlock = createSessionBlock(session);
                cell.appendChild(sessionBlock);
            }
            
            grid.appendChild(cell);
        });
    });
}

function createGridElement(tag, className, content = '') {
    const element = document.createElement(tag);
    element.className = className;
    if (content) element.textContent = content;
    return element;
}

function createSessionBlock(session) {
    const block = document.createElement('div');
    block.className = 'session-block draggable';
    // Add conflicts for sessions that conflict (instructor double-booked)
    if (session.id === '1' || session.id === '3' || session.id === '6') {
        block.classList.add('conflict');
    }
    block.dataset.id = session.id;
    block.draggable = true;
    
    block.innerHTML = `
        <div class="session-header">${session.course_name} S${session.session}</div>
        <div class="session-details">${session.instructor_name} | ${session.student_groups.join(', ')}</div>
        <div class="session-actions">
            <button class="lock-btn" data-id="${session.id}">🔓</button>
        </div>
    `;
    
    return block;
}

function formatTimeSlot(timeSlot) {
    const [day, time] = timeSlot.split('_');
    const dayNames = {
        'MON': 'Monday',
        'TUE': 'Tuesday', 
        'WED': 'Wednesday',
        'THU': 'Thursday',
        'FRI': 'Friday'
    };
    
    if (time.includes('_')) {
        const [start, end] = time.split('_');
        return `${dayNames[day]} ${start}:00-${end}:00`;
    } else {
        return `${dayNames[day]} ${time.replace('_', ':')}`;
    }
}

// Fixed Drag and Drop Implementation
function initDragAndDrop() {
    const sessionBlocks = document.querySelectorAll('.session-block.draggable');
    const scheduleCells = document.querySelectorAll('.schedule-cell');
    
    sessionBlocks.forEach(block => {
        block.removeEventListener('dragstart', handleDragStart);
        block.removeEventListener('dragend', handleDragEnd);
        block.addEventListener('dragstart', handleDragStart);
        block.addEventListener('dragend', handleDragEnd);
    });
    
    scheduleCells.forEach(cell => {
        cell.removeEventListener('dragover', handleDragOver);
        cell.removeEventListener('dragenter', handleDragEnter);
        cell.removeEventListener('dragleave', handleDragLeave);
        cell.removeEventListener('drop', handleDrop);
        
        cell.addEventListener('dragover', handleDragOver);
        cell.addEventListener('dragenter', handleDragEnter);
        cell.addEventListener('dragleave', handleDragLeave);
        cell.addEventListener('drop', handleDrop);
    });
}

let dragCounter = 0;

function handleDragStart(e) {
    if (!e.target.classList.contains('session-block')) return;
    
    AppState.draggedElement = e.target;
    const cell = e.target.closest('.schedule-cell');
    if (cell) {
        AppState.draggedData = {
            id: e.target.dataset.id,
            originalTime: cell.dataset.time,
            originalRoom: cell.dataset.room
        };
    }
    
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
    
    dragCounter = 0;
}

function handleDragEnd(e) {
    if (!e.target.classList.contains('session-block')) return;
    
    e.target.classList.remove('dragging');
    
    // Clear all drop indicators
    document.querySelectorAll('.drop-target, .drop-invalid').forEach(cell => {
        cell.classList.remove('drop-target', 'drop-invalid');
    });
    
    // Clear drag feedback
    const dragFeedback = document.getElementById('drag-feedback');
    if (dragFeedback) {
        dragFeedback.classList.add('hidden');
    }
    
    AppState.draggedElement = null;
    AppState.draggedData = null;
    dragCounter = 0;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    e.preventDefault();
    if (!e.currentTarget.classList.contains('schedule-cell')) return;
    
    dragCounter++;
    
    const existingSession = e.currentTarget.querySelector('.session-block:not(.dragging)');
    if (existingSession) {
        e.currentTarget.classList.add('drop-invalid');
        e.currentTarget.classList.remove('drop-target');
    } else {
        e.currentTarget.classList.add('drop-target');
        e.currentTarget.classList.remove('drop-invalid');
    }
}

function handleDragLeave(e) {
    dragCounter--;
    
    if (dragCounter <= 0) {
        if (e.currentTarget.classList.contains('schedule-cell')) {
            e.currentTarget.classList.remove('drop-target', 'drop-invalid');
        }
    }
}

function handleDrop(e) {
    e.preventDefault();
    dragCounter = 0;
    
    const cell = e.currentTarget;
    if (!cell.classList.contains('schedule-cell') || !AppState.draggedData) return;
    
    const existingSession = cell.querySelector('.session-block:not(.dragging)');
    if (existingSession) {
        showToast('Cannot drop here - slot already occupied', 'error');
        cell.classList.remove('drop-target', 'drop-invalid');
        return;
    }
    
    // Update schedule data
    const session = AppState.scheduleData.find(s => s.id === AppState.draggedData.id);
    if (session) {
        session.time_slot = cell.dataset.time;
        session.room_id = cell.dataset.room;
    }
    
    // Move DOM element
    if (AppState.draggedElement) {
        AppState.draggedElement.classList.remove('dragging');
        cell.appendChild(AppState.draggedElement);
    }
    
    // Update conflict detection and metrics
    detectAndUpdateConflicts();
    showToast(`Session moved to ${formatTimeSlot(cell.dataset.time)} in ${cell.dataset.room}`, 'success');
    
    cell.classList.remove('drop-target', 'drop-invalid');
    
    // Re-initialize drag and drop for the moved element
    initDragAndDrop();
}

function detectAndUpdateConflicts() {
    // Simple conflict detection for demo
    const conflicts = new Set();
    const timeRoomMap = new Map();
    const instructorTimeMap = new Map();
    
    AppState.scheduleData.forEach(session => {
        const timeRoomKey = `${session.time_slot}_${session.room_id}`;
        const instructorTimeKey = `${session.instructor_id}_${session.time_slot}`;
        
        // Check room conflicts
        if (timeRoomMap.has(timeRoomKey)) {
            conflicts.add(session.id);
            conflicts.add(timeRoomMap.get(timeRoomKey));
        } else {
            timeRoomMap.set(timeRoomKey, session.id);
        }
        
        // Check instructor conflicts  
        if (instructorTimeMap.has(instructorTimeKey)) {
            conflicts.add(session.id);
            conflicts.add(instructorTimeMap.get(instructorTimeKey));
        } else {
            instructorTimeMap.set(instructorTimeKey, session.id);
        }
    });
    
    // Update conflict highlighting
    document.querySelectorAll('.session-block').forEach(block => {
        block.classList.remove('conflict');
        if (conflicts.has(block.dataset.id)) {
            block.classList.add('conflict');
        }
    });
    
    // Update metrics
    AppState.currentMetrics.hardConflicts = Math.floor(conflicts.size / 2);
    const liveConflicts = document.getElementById('live-conflicts');
    if (liveConflicts) liveConflicts.textContent = AppState.currentMetrics.hardConflicts;
    
    const editStatus = document.getElementById('edit-status');
    if (editStatus) {
        if (AppState.currentMetrics.hardConflicts === 0) {
            editStatus.innerHTML = '<span class="status-indicator ready"></span><span class="status-text">No conflicts detected!</span>';
            showToast('Great! All conflicts resolved!', 'success');
        } else {
            editStatus.innerHTML = '<span class="status-indicator conflict"></span><span class="status-text">Conflicts detected - continue editing</span>';
        }
    }
}

function undoEdit() {
    showToast('Undo functionality would restore previous state', 'info');
}

function resetSchedule() {
    if (confirm('Reset all changes to the original schedule?')) {
        loadSampleSchedule();
    }
}

// Application Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initTabNavigation();
    initUploadTab();
    initConfigureTab();
    initSchedulerTab();
    initVisualizeTab();
    initExportTab();
    initEditorTab();
    
    updateConfigUI();
    updateTabState();
    
    showToast('Welcome to the Conflict-Free Summer Term Scheduler! Start by uploading data or loading sample data.', 'success');
});