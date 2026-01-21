import json
import os
import uuid
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
REPORTS_FILE = os.path.join(DATA_DIR, 'reports.json')

def init_db():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    if not os.path.exists(REPORTS_FILE):
        with open(REPORTS_FILE, 'w') as f:
            json.dump([], f)
    print(f"✅ JSON Database initialized at {REPORTS_FILE}")
    return True

def save_report(report_data):
    try:
        # Load existing
        with open(REPORTS_FILE, 'r') as f:
            reports = json.load(f)
        
        # Add ID and ensure timestamp is string if not already
        if '_id' not in report_data:
            report_data['_id'] = str(uuid.uuid4())
        
        # Format timestamp for JSON serialization if it's a datetime object
        if isinstance(report_data.get('timestamp'), datetime):
             report_data['timestamp'] = report_data['timestamp'].isoformat()

        reports.append(report_data)
        
        # Save back
        with open(REPORTS_FILE, 'w') as f:
            json.dump(reports, f, indent=4)
            
        return report_data
    except Exception as e:
        print(f"JSON DB Save Error: {e}")
        raise e

def get_all_reports():
    try:
        if not os.path.exists(REPORTS_FILE):
            return []
        with open(REPORTS_FILE, 'r') as f:
            reports = json.load(f)
        # Sort by timestamp desc (newest first)
        reports.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        return reports
    except Exception as e:
        print(f"JSON DB Read Error: {e}")
        return []
