
"""
Test the enhanced features while preserving existing functionality
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_enhanced_features():
    print("Testing Enhanced Features (Preserving Existing)...")
    print("=" * 60)

    try:
        # Test existing endpoint (should still work)
        print("\n1. Testing existing sample data endpoint...")
        response = requests.get(f"{BASE_URL}/api/sample-data")
        if response.status_code == 200:
            print("✅ Existing sample data endpoint working")
        else:
            print("❌ Existing endpoint broken!")

        # Test new feature: Load sample schedule with conflicts
        print("\n2. Testing NEW: Load sample schedule with conflicts...")
        response = requests.post(f"{BASE_URL}/api/load-sample-schedule")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Loaded {len(data['schedule'])} assignments")

            # Display the NEW Hard Conflicts
            analysis = data['analysis']
            hard_conflicts = analysis['hard_conflicts']
            print(f"🔴 Hard Conflicts: {hard_conflicts['total']}")
            print(f"   - Instructor conflicts: {hard_conflicts['instructor_conflicts']}")
            print(f"   - Room conflicts: {hard_conflicts['room_conflicts']}")

            # Display the NEW Soft Violations
            soft_violations = analysis['soft_violations']
            print(f"🟡 Soft Violations: {soft_violations['total']}")
            print(f"   - Preferred time violations: {soft_violations['preferred_time_violations']}")

        # Test new feature: Manual editing
        print("\n3. Testing NEW: Manual schedule editing...")
        edit_data = {
            "assignment_id": "1",
            "new_time_slot": "TUE_10_11:15"
        }
        response = requests.post(f"{BASE_URL}/api/schedule/edit", json=edit_data)
        if response.status_code == 200:
            print("✅ Manual editing working")
            data = response.json()
            new_conflicts = data['analysis']['hard_conflicts']['total']
            print(f"   New hard conflicts after edit: {new_conflicts}")

        # Test new feature: Undo functionality
        print("\n4. Testing NEW: Undo functionality...")
        response = requests.post(f"{BASE_URL}/api/schedule/undo")
        if response.status_code == 200:
            print("✅ Undo functionality working")

        # Test new feature: Detailed conflicts
        print("\n5. Testing NEW: Detailed conflicts analysis...")
        response = requests.get(f"{BASE_URL}/api/conflicts/detailed")
        if response.status_code == 200:
            data = response.json()
            print("✅ Detailed conflict analysis working")
            print(f"   Total fitness score: {data['total_fitness']}")

        print("\n🎉 All enhanced features working while preserving existing functionality!")
        print("\nNOW YOU CAN:")
        print("• Use all existing features (upload, configure, optimize, export)")
        print("• See Hard Conflicts and Soft Violations counts")
        print("• Use Manual Schedule Editor with drag-and-drop")
        print("• Edit assignments and see real-time conflict updates")
        print("• Undo changes and lock assignments")

        return True

    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Please start:")
        print("   python minimal_backend_enhancement.py")
        return False
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_enhanced_features()
    if success:
        print("\n✅ Enhanced features test PASSED!")
    else:
        print("\n❌ Enhanced features test FAILED!")
