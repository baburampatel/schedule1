
"""
Simple test to verify the Editor tab fix is working
"""

def test_editor_tab_fix():
    print("Testing Editor Tab Fix...")
    print("=" * 40)

    # Test 1: Check if required files exist
    print("\n1. Checking required files...")

    import os
    required_files = [
        'editor_tab_fix.js',
        'editor_tab_html_patch.html',
        'minimal_backend_enhancement.py'
    ]

    missing_files = []
    for file in required_files:
        if os.path.exists(file):
            print(f"✅ {file} found")
        else:
            print(f"❌ {file} missing")
            missing_files.append(file)

    if missing_files:
        print(f"\n❌ Missing files: {missing_files}")
        print("Please ensure all fix files are in the same directory")
        return False

    # Test 2: Check backend endpoints
    print("\n2. Testing backend endpoints...")

    try:
        import requests
        BASE_URL = "http://localhost:8000"

        # Test health check
        response = requests.get(f"{BASE_URL}/", timeout=5)
        if response.status_code == 200:
            print("✅ Backend is running")
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False

        # Test sample schedule loading
        response = requests.post(f"{BASE_URL}/api/load-sample-schedule", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Sample schedule loaded: {len(data['schedule'])} assignments")
            print(f"   Hard conflicts: {data['analysis']['hard_conflicts']['total']}")
            print(f"   Soft violations: {data['analysis']['soft_violations']['total']}")
        else:
            print(f"❌ Sample schedule loading failed: {response.status_code}")
            return False

        # Test manual editing
        edit_data = {
            "assignment_id": "1",
            "new_time_slot": "TUE_10_11:15"
        }
        response = requests.post(f"{BASE_URL}/api/schedule/edit", json=edit_data, timeout=10)
        if response.status_code == 200:
            print("✅ Manual editing endpoint working")
        else:
            print(f"❌ Manual editing failed: {response.status_code}")
            return False

    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend")
        print("Please start the backend first: python minimal_backend_enhancement.py")
        return False
    except Exception as e:
        print(f"❌ Backend test failed: {str(e)}")
        return False

    # Test 3: Check JavaScript functions
    print("\n3. Checking JavaScript functions...")

    with open('editor_tab_fix.js', 'r') as f:
        js_content = f.read()

    required_functions = [
        'initializeEditor',
        'renderEditorScheduleGrid', 
        'handleDragStart',
        'handleDrop',
        'moveAssignment',
        'updateEditorMetrics',
        'setupDragAndDrop'
    ]

    for func in required_functions:
        if func in js_content:
            print(f"✅ {func} function found")
        else:
            print(f"❌ {func} function missing")
            return False

    # Test 4: Check HTML elements
    print("\n4. Checking HTML elements...")

    with open('editor_tab_html_patch.html', 'r') as f:
        html_content = f.read()

    required_elements = [
        'editor-hard-conflicts',
        'editor-soft-violations',
        'editor-schedule-grid',
        'load-schedule-for-editing',
        'undo-edit-btn',
        'reset-schedule-btn'
    ]

    for element in required_elements:
        if element in html_content:
            print(f"✅ {element} element found")
        else:
            print(f"❌ {element} element missing")
            return False

    print("\n🎉 All Editor Tab Fix components are ready!")
    print("\n📋 Next Steps:")
    print("1. Replace your Editor tab HTML with content from editor_tab_html_patch.html")
    print("2. Add editor_tab_fix.js functions to your app.js file")
    print("3. Ensure minimal_backend_enhancement.py is running")
    print("4. Open your web application and test the Editor tab")

    print("\n✅ Expected Editor Tab Functionality:")
    print("• Load Sample Schedule button works")
    print("• Interactive schedule grid appears") 
    print("• Drag-and-drop assignments between time slots")
    print("• Real-time Hard Conflicts and Soft Violations display")
    print("• Undo/Redo buttons function")
    print("• Visual conflict highlighting")
    print("• All other tabs remain unchanged")

    return True

if __name__ == "__main__":
    success = test_editor_tab_fix()
    if success:
        print("\n✅ EDITOR TAB FIX TEST PASSED!")
        print("Your Editor tab should now work properly!")
    else:
        print("\n❌ EDITOR TAB FIX TEST FAILED!")
        print("Please check the issues above before proceeding.")
