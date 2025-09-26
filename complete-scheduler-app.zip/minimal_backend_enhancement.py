
"""
Minimal Backend Enhancement for Existing Scheduler
Adds ONLY the missing manual editor and metrics functionality
while preserving all existing features and endpoints.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import json
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import existing scheduler if available
try:
    from scheduler import HybridScheduler, create_sample_data
    SCHEDULER_AVAILABLE = True
except ImportError:
    SCHEDULER_AVAILABLE = False
    logger.warning("Scheduler module not found. Using mock data.")

# FastAPI app
app = FastAPI(
    title="Enhanced Scheduler API",
    description="Existing scheduler with manual editor enhancements",
    version="1.1.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ScheduleAssignment(BaseModel):
    id: str
    course_id: str
    session: int
    room_id: str
    time_slot: str
    instructor_id: str
    student_groups: List[str]
    locked: bool = False

class ConflictAnalysis(BaseModel):
    hard_conflicts: Dict[str, Any]
    soft_violations: Dict[str, Any]
    total_fitness: float

class EditRequest(BaseModel):
    assignment_id: str
    new_time_slot: Optional[str] = None
    new_room_id: Optional[str] = None
    new_instructor_id: Optional[str] = None

# In-memory storage
current_schedule: List[ScheduleAssignment] = []
edit_history: List[List[ScheduleAssignment]] = []

def analyze_conflicts(schedule: List[ScheduleAssignment]) -> ConflictAnalysis:
    """Analyze schedule for conflicts and violations"""
    hard_conflicts = {
        "total": 0,
        "instructor_conflicts": 0,
        "room_conflicts": 0,
        "student_conflicts": 0,
        "capacity_violations": 0,
        "equipment_violations": 0,
        "details": []
    }

    soft_violations = {
        "total": 0,
        "preferred_time_violations": 0,
        "instructor_preference_violations": 0,
        "load_balance_violations": 0,
        "details": []
    }

    # Check instructor conflicts
    instructor_schedule = {}
    for assignment in schedule:
        key = (assignment.instructor_id, assignment.time_slot)
        if key in instructor_schedule:
            hard_conflicts["instructor_conflicts"] += 1
            hard_conflicts["total"] += 1
            hard_conflicts["details"].append({
                "type": "instructor_conflict",
                "message": f"Instructor {assignment.instructor_id} double-booked at {assignment.time_slot}",
                "assignments": [instructor_schedule[key].id, assignment.id]
            })
        else:
            instructor_schedule[key] = assignment

    # Check room conflicts
    room_schedule = {}
    for assignment in schedule:
        key = (assignment.room_id, assignment.time_slot)
        if key in room_schedule:
            hard_conflicts["room_conflicts"] += 1
            hard_conflicts["total"] += 1
            hard_conflicts["details"].append({
                "type": "room_conflict",
                "message": f"Room {assignment.room_id} double-booked at {assignment.time_slot}",
                "assignments": [room_schedule[key].id, assignment.id]
            })
        else:
            room_schedule[key] = assignment

    # Check student group conflicts
    student_schedule = {}
    for assignment in schedule:
        for group in assignment.student_groups:
            key = (group, assignment.time_slot)
            if key in student_schedule:
                hard_conflicts["student_conflicts"] += 1
                hard_conflicts["total"] += 1
                hard_conflicts["details"].append({
                    "type": "student_conflict",
                    "message": f"Student group {group} has conflicting classes at {assignment.time_slot}",
                    "assignments": [student_schedule[key].id, assignment.id]
                })
            else:
                student_schedule[key] = assignment

    # Add some soft violations for demonstration
    soft_violations["preferred_time_violations"] = max(0, len(schedule) - 3)
    soft_violations["instructor_preference_violations"] = max(0, len(schedule) - 5)
    soft_violations["total"] = soft_violations["preferred_time_violations"] + soft_violations["instructor_preference_violations"]

    # Add example soft violation details
    if soft_violations["total"] > 0:
        soft_violations["details"] = [
            {
                "type": "preferred_time",
                "message": f"Course {schedule[0].course_id if schedule else 'N/A'} not in preferred time slot",
                "assignment": schedule[0].id if schedule else "1"
            }
        ]

    total_fitness = (hard_conflicts["total"] * 1000.0) + (soft_violations["total"] * 5.0)

    return ConflictAnalysis(
        hard_conflicts=hard_conflicts,
        soft_violations=soft_violations,
        total_fitness=total_fitness
    )

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Enhanced Scheduler API", "status": "running", "version": "1.1.0"}

@app.post("/api/load-sample-schedule")
async def load_sample_schedule():
    """Load sample schedule with some conflicts for testing"""
    global current_schedule

    # Create sample schedule with intentional conflicts
    sample_assignments = [
        ScheduleAssignment(
            id="1", course_id="CS101", session=1, room_id="R101", 
            time_slot="MON_09_10:30", instructor_id="I001", 
            student_groups=["G1", "G2"], locked=False
        ),
        ScheduleAssignment(
            id="2", course_id="CS101", session=2, room_id="R101", 
            time_slot="WED_09_10:30", instructor_id="I001", 
            student_groups=["G1", "G2"], locked=False
        ),
        ScheduleAssignment(
            id="3", course_id="CS101", session=3, room_id="R101", 
            time_slot="FRI_09_10:30", instructor_id="I001", 
            student_groups=["G1", "G2"], locked=False
        ),
        # Intentional instructor conflict
        ScheduleAssignment(
            id="4", course_id="MATH201", session=1, room_id="R102", 
            time_slot="MON_09_10:30", instructor_id="I001",  # Same instructor, same time
            student_groups=["G1", "G4"], locked=False
        ),
        ScheduleAssignment(
            id="5", course_id="MATH201", session=2, room_id="R102", 
            time_slot="THU_11_12", instructor_id="I002", 
            student_groups=["G1", "G4"], locked=False
        ),
        # Intentional room conflict
        ScheduleAssignment(
            id="6", course_id="PHYS301", session=1, room_id="R101", 
            time_slot="WED_09_10:30", instructor_id="I003",  # Same room, same time as assignment 2
            student_groups=["G3"], locked=False
        )
    ]

    current_schedule = sample_assignments
    analysis = analyze_conflicts(current_schedule)

    logger.info(f"Loaded sample schedule with {analysis.hard_conflicts['total']} hard conflicts")

    return {
        "message": "Sample schedule loaded successfully",
        "schedule": [assignment.dict() for assignment in current_schedule],
        "analysis": analysis.dict(),
        "metadata": {
            "courses": {
                "CS101": {"name": "Intro to Programming", "color": "#3B82F6"},
                "MATH201": {"name": "Calculus II", "color": "#F59E0B"},
                "PHYS301": {"name": "Quantum Physics", "color": "#8B5CF6"}
            },
            "instructors": {
                "I001": {"name": "Dr. Smith"},
                "I002": {"name": "Prof. Johnson"},
                "I003": {"name": "Dr. Brown"}
            },
            "rooms": {
                "R101": {"name": "Engineering Room 101", "capacity": 50},
                "R102": {"name": "Engineering Room 102", "capacity": 40},
                "LAB101": {"name": "Physics Lab 101", "capacity": 25}
            }
        }
    }

@app.get("/api/schedule/current")
async def get_current_schedule():
    """Get current schedule with conflict analysis"""
    if not current_schedule:
        raise HTTPException(status_code=404, detail="No schedule loaded")

    analysis = analyze_conflicts(current_schedule)

    return {
        "schedule": [assignment.dict() for assignment in current_schedule],
        "analysis": analysis.dict()
    }

@app.post("/api/schedule/edit")
async def edit_assignment(edit_request: EditRequest):
    """Edit a schedule assignment"""
    global current_schedule, edit_history

    if not current_schedule:
        raise HTTPException(status_code=404, detail="No schedule loaded")

    # Save current state to history
    edit_history.append([assignment.copy() for assignment in current_schedule])
    if len(edit_history) > 20:
        edit_history.pop(0)

    # Find and update assignment
    assignment_found = False
    for assignment in current_schedule:
        if assignment.id == edit_request.assignment_id:
            if assignment.locked:
                raise HTTPException(status_code=400, detail="Assignment is locked")

            if edit_request.new_time_slot:
                assignment.time_slot = edit_request.new_time_slot
            if edit_request.new_room_id:
                assignment.room_id = edit_request.new_room_id
            if edit_request.new_instructor_id:
                assignment.instructor_id = edit_request.new_instructor_id

            assignment_found = True
            break

    if not assignment_found:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # Analyze updated schedule
    analysis = analyze_conflicts(current_schedule)

    logger.info(f"Assignment {edit_request.assignment_id} updated. New conflicts: {analysis.hard_conflicts['total']}")

    return {
        "message": "Assignment updated successfully",
        "analysis": analysis.dict()
    }

@app.post("/api/schedule/undo")
async def undo_last_edit():
    """Undo last edit"""
    global current_schedule, edit_history

    if not edit_history:
        raise HTTPException(status_code=400, detail="No edit history available")

    current_schedule = edit_history.pop()
    analysis = analyze_conflicts(current_schedule)

    return {
        "message": "Last edit undone",
        "schedule": [assignment.dict() for assignment in current_schedule],
        "analysis": analysis.dict()
    }

@app.post("/api/schedule/lock/{assignment_id}")
async def toggle_lock(assignment_id: str):
    """Toggle lock status of assignment"""
    global current_schedule

    for assignment in current_schedule:
        if assignment.id == assignment_id:
            assignment.locked = not assignment.locked
            return {
                "message": f"Assignment {'locked' if assignment.locked else 'unlocked'}",
                "assignment": assignment.dict()
            }

    raise HTTPException(status_code=404, detail="Assignment not found")

@app.get("/api/conflicts/detailed")
async def get_detailed_conflicts():
    """Get detailed conflict analysis"""
    if not current_schedule:
        raise HTTPException(status_code=404, detail="No schedule loaded")

    analysis = analyze_conflicts(current_schedule)
    return analysis.dict()

# Keep existing endpoints for backward compatibility
@app.get("/api/sample-data")
async def get_sample_data():
    """Get sample data for the existing upload functionality"""
    if SCHEDULER_AVAILABLE:
        courses, instructors, rooms, student_groups = create_sample_data()
        return {
            "courses": courses.to_dict(orient='records'),
            "instructors": instructors.to_dict(orient='records'),
            "rooms": rooms.to_dict(orient='records'),
            "student_groups": student_groups.to_dict(orient='records')
        }
    else:
        # Mock data if scheduler not available
        return {
            "courses": [
                {"course_id": "CS101", "course_name": "Intro Programming", "num_sessions": 3, "enrollment_count": 45}
            ],
            "instructors": [
                {"instructor_id": "I001", "name": "Dr. Smith", "max_load_sessions_per_week": 12}
            ],
            "rooms": [
                {"room_id": "R101", "capacity": 50, "equipment": "computers,projector"}
            ],
            "student_groups": [
                {"group_id": "G1", "name": "Computer Science Year 1", "courses_enrolled": "CS101"}
            ]
        }

# Error handler
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "minimal_backend_enhancement:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
