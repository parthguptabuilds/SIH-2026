"""
RailBlock.AI — Realistic Synthetic Dataset Generator
SIH 2026 | Problem Statement ID: SIH26027 | Team: Code Crafter
Corridor: 4-Track Delhi–Howrah High-Density Network, Prayagraj (PRYJ) Division

Tracks Modeled:
- Track 1: UP Main (High-speed passenger through-line to New Delhi)
- Track 2: DN Main (High-speed passenger through-line to Howrah / Patna)
- Track 3: UP Loop (Slow / Freight / Regulated bypass loop line)
- Track 4: DN Loop (Slow / Freight / Regulated bypass loop line with TSR 30 km/h)
"""

import json
import os
import random
from datetime import datetime, timedelta

def generate_datasets():
    # Base paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    src_data_dir = os.path.join(project_root, "src", "data")
    os.makedirs(src_data_dir, exist_ok=True)

    # -------------------------------------------------------------------------
    # 1. GENERATE REQUISITIONS (requisitions.json)
    # -------------------------------------------------------------------------
    requisitions = [
        # --- PRIMARY TRI-DEPARTMENT CO-LOCATION ON TRACK 2 (10:00 - 14:00) ---
        {
            "req_id": "REQ-CIV-101",
            "department": "Civil (P-Way)",
            "work_type": "CSM-09 Continuous Action Tamping & Ballast Packing",
            "track_section": "Track 2: DN Main (KM 131.420 to KM 142.100)",
            "requested_start_time": "10:00",
            "requested_end_time": "13:00",
            "priority": "HIGH",
            "conflict_tag": "TRI_DEPT_SHADOW_CANDIDATE",
            # Normalized frontend helper fields
            "id": "REQ-CIV-101",
            "dept": "civil",
            "deptCode": "CIVIL",
            "deptName": "Civil Engineering (P-Way)",
            "track": "Track 2 (DN Main)",
            "trackId": "track2",
            "asset": "CSM-09 Continuous Action Tamping Machine",
            "startTime": "10:00",
            "endTime": "13:00",
            "durationMinutes": 180,
            "section": "Track 2 DN Main, Aligarh–Tundla KM 131–209",
            "timestamp": "Today, 08:30 AM",
            "notes": "Ballast packing, cross-level correction & track geometry alignment KM 131.420 to 142.100."
        },
        {
            "req_id": "REQ-TRD-102",
            "department": "Electrical (TRD)",
            "work_type": "25kV OHE Catenary Contact Wire Inspection & Dropper Renewal",
            "track_section": "Track 2: DN Main (KM 131.420 to KM 142.100)",
            "requested_start_time": "11:30",
            "requested_end_time": "14:00",
            "priority": "HIGH",
            "conflict_tag": "TRI_DEPT_SHADOW_CANDIDATE",
            # Normalized frontend helper fields
            "id": "REQ-TRD-102",
            "dept": "trd",
            "deptCode": "TRD",
            "deptName": "Electrical (TRD)",
            "track": "Track 2 (DN Main)",
            "trackId": "track2",
            "asset": "Tower Wagon (RU-843) 25kV OHE Inspection",
            "startTime": "11:30",
            "endTime": "14:00",
            "durationMinutes": 150,
            "section": "Track 2 DN Main, Aligarh–Tundla KM 131–209",
            "timestamp": "Today, 08:45 AM",
            "notes": "25kV catenary contact wire renewal & dropper realignment under Feeder F-04 power cut."
        },
        {
            "req_id": "REQ-ST-103",
            "department": "Signalling (S&T)",
            "work_type": "Point Machine Overhaul & Axle Counter Reset",
            "track_section": "Track 2: DN Main (KM 131.420 to KM 142.100)",
            "requested_start_time": "12:00",
            "requested_end_time": "13:30",
            "priority": "CRITICAL",
            "conflict_tag": "TRI_DEPT_SHADOW_CANDIDATE",
            # Normalized frontend helper fields
            "id": "REQ-ST-103",
            "dept": "st",
            "deptCode": "ST",
            "deptName": "Signalling & Telecom (S&T)",
            "track": "Track 2 (DN Main)",
            "trackId": "track2",
            "asset": "Point Machine Overhaul & Axle Counter Reset",
            "startTime": "12:00",
            "endTime": "13:30",
            "durationMinutes": 90,
            "section": "Track 2 DN Main, Aligarh–Tundla KM 131–209",
            "timestamp": "Today, 09:00 AM",
            "notes": "Turnout SW #4/#5 point machine overhaul, lock bar adjustment & digital axle counter re-calibration."
        },

        # --- SECONDARY DUAL-DEPARTMENT OVERLAP ON TRACK 1 (02:00 - 05:00) ---
        {
            "req_id": "REQ-CIV-104",
            "department": "Civil (P-Way)",
            "work_type": "Deep Ballast Screening & Rail Flaw Ultrasound (USFD)",
            "track_section": "Track 1: UP Main (KM 160.000 to KM 174.500)",
            "requested_start_time": "02:00",
            "requested_end_time": "04:30",
            "priority": "HIGH",
            "conflict_tag": "DUAL_DEPT_OVERLAP",
            "id": "REQ-CIV-104",
            "dept": "civil",
            "deptCode": "CIVIL",
            "deptName": "Civil Engineering (P-Way)",
            "track": "Track 1 (UP Main)",
            "trackId": "track1",
            "asset": "BCM Deep Ballast Cleaner + USFD Trolley",
            "startTime": "02:00",
            "endTime": "04:30",
            "durationMinutes": 150,
            "section": "Track 1 UP Main, Subedarganj–Fatehpur KM 160–175",
            "timestamp": "Today, 07:15 AM",
            "notes": "BCM deep ballast screening and ultrasonic rail weld flaw detection."
        },
        {
            "req_id": "REQ-TRD-105",
            "department": "Electrical (TRD)",
            "work_type": "25kV Catenary Contact Wire Renewal / Tower Wagon",
            "track_section": "Track 1: UP Main (KM 160.000 to KM 174.500)",
            "requested_start_time": "03:00",
            "requested_end_time": "05:00",
            "priority": "MEDIUM",
            "conflict_tag": "DUAL_DEPT_OVERLAP",
            "id": "REQ-TRD-105",
            "dept": "trd",
            "deptCode": "TRD",
            "deptName": "Electrical (TRD)",
            "track": "Track 1 (UP Main)",
            "trackId": "track1",
            "asset": "Tower Wagon TW-302 (Traction Isolation)",
            "startTime": "03:00",
            "endTime": "05:00",
            "durationMinutes": 120,
            "section": "Track 1 UP Main, Subedarganj–Fatehpur KM 160–175",
            "timestamp": "Today, 07:30 AM",
            "notes": "Catenary section insulator and contact wire renewal under power block."
        },

        # --- NOMINAL THROUGH-MAINTENANCE ON INDEPENDENT SECTIONS ---
        {
            "req_id": "REQ-ST-106",
            "department": "Signalling (S&T)",
            "work_type": "Electronic Interlocking (EI) Balise Calibration",
            "track_section": "Track 3: UP Loop (KM 135.000 to KM 138.000)",
            "requested_start_time": "06:00",
            "requested_end_time": "07:30",
            "priority": "ROUTINE",
            "conflict_tag": "INDEPENDENT_WINDOW",
            "id": "REQ-ST-106",
            "dept": "st",
            "deptCode": "ST",
            "deptName": "Signalling & Telecom (S&T)",
            "track": "Track 3 (UP Loop)",
            "trackId": "track3",
            "asset": "Kavach Balise Programmer & Test Kit",
            "startTime": "06:00",
            "endTime": "07:30",
            "durationMinutes": 90,
            "section": "Track 3 UP Loop, Aligarh Yard",
            "timestamp": "Today, 06:00 AM",
            "notes": "Kavach trackside balise signal attenuation and telegram verification."
        },
        {
            "req_id": "REQ-CIV-107",
            "department": "Civil (P-Way)",
            "work_type": "USFD Rail Flaw Testing Trolley Run",
            "track_section": "Track 4: DN Loop (KM 140.000 to KM 152.000)",
            "requested_start_time": "08:00",
            "requested_end_time": "09:30",
            "priority": "MEDIUM",
            "conflict_tag": "INDEPENDENT_WINDOW",
            "id": "REQ-CIV-107",
            "dept": "civil",
            "deptCode": "CIVIL",
            "deptName": "Civil Engineering (P-Way)",
            "track": "Track 4 (DN Loop)",
            "trackId": "track4",
            "asset": "Digital Double Rail Tester (DDRT)",
            "startTime": "08:00",
            "endTime": "09:30",
            "durationMinutes": 90,
            "section": "Track 4 DN Loop, Hathras Junction",
            "timestamp": "Today, 06:45 AM",
            "notes": "Non-destructive testing of rail internal fissures and web cracks."
        },
        {
            "req_id": "REQ-TRD-108",
            "department": "Electrical (TRD)",
            "work_type": "Traction Substation (TSS) Isolator Maintenance",
            "track_section": "Track 1: UP Main (KM 180.000 to KM 185.000)",
            "requested_start_time": "15:00",
            "requested_end_time": "16:30",
            "priority": "ROUTINE",
            "conflict_tag": "INDEPENDENT_WINDOW",
            "id": "REQ-TRD-108",
            "dept": "trd",
            "deptCode": "TRD",
            "deptName": "Electrical (TRD)",
            "track": "Track 1 (UP Main)",
            "trackId": "track1",
            "asset": "SCADA Switching Unit + Mobile Gang",
            "startTime": "15:00",
            "endTime": "16:30",
            "durationMinutes": 90,
            "section": "Track 1 UP Main, Tundla East",
            "timestamp": "Today, 09:30 AM",
            "notes": "Isolator switch blade contact resistance testing and lubrication."
        },
        {
            "req_id": "REQ-ST-109",
            "department": "Signalling (S&T)",
            "work_type": "Digital Axle Counter (DAC) Tuning & Calibration",
            "track_section": "Track 2: DN Main (KM 190.000 to KM 195.000)",
            "requested_start_time": "16:30",
            "requested_end_time": "18:00",
            "priority": "ROUTINE",
            "conflict_tag": "INDEPENDENT_WINDOW",
            "id": "REQ-ST-109",
            "dept": "st",
            "deptCode": "ST",
            "deptName": "Signalling & Telecom (S&T)",
            "track": "Track 2 (DN Main)",
            "trackId": "track2",
            "asset": "DAC High-Frequency Oscilloscope & Toolset",
            "startTime": "16:30",
            "endTime": "18:00",
            "durationMinutes": 90,
            "section": "Track 2 DN Main, Barhan Jn",
            "timestamp": "Today, 10:15 AM",
            "notes": "Wheel sensor impedance matching and carrier frequency alignment."
        },
        {
            "req_id": "REQ-CIV-110",
            "department": "Civil (P-Way)",
            "work_type": "Turnout Packing & Diamond Crossing Dressing",
            "track_section": "Track 4: DN Loop (KM 170.000 to KM 172.500)",
            "requested_start_time": "18:30",
            "requested_end_time": "20:00",
            "priority": "MEDIUM",
            "conflict_tag": "INDEPENDENT_WINDOW",
            "id": "REQ-CIV-110",
            "dept": "civil",
            "deptCode": "CIVIL",
            "deptName": "Civil Engineering (P-Way)",
            "track": "Track 4 (DN Loop)",
            "trackId": "track4",
            "asset": "Unomatic Tamper Machine UN-44",
            "startTime": "18:30",
            "endTime": "20:00",
            "durationMinutes": 90,
            "section": "Track 4 DN Loop, Tundla Yard Bypass",
            "timestamp": "Today, 11:00 AM",
            "notes": "Turnout curved switch point tamping and stock rail clearance profile check."
        },
        {
            "req_id": "REQ-TRD-111",
            "department": "Electrical (TRD)",
            "work_type": "Catenary Dropper Adjustment & Cantilever Greasing",
            "track_section": "Track 3: UP Loop (KM 150.000 to KM 155.000)",
            "requested_start_time": "21:00",
            "requested_end_time": "22:30",
            "priority": "ROUTINE",
            "conflict_tag": "INDEPENDENT_WINDOW",
            "id": "REQ-TRD-111",
            "dept": "trd",
            "deptCode": "TRD",
            "deptName": "Electrical (TRD)",
            "track": "Track 3 (UP Loop)",
            "trackId": "track3",
            "asset": "Ladder Trolley & Ground Discharge Rods",
            "startTime": "21:00",
            "endTime": "22:30",
            "durationMinutes": 90,
            "section": "Track 3 UP Loop, Daud Khan Yard",
            "timestamp": "Today, 11:45 AM",
            "notes": "Night possession: Dropper tensioning and insulator spark-gap verification."
        },
        {
            "req_id": "REQ-ST-112",
            "department": "Signalling (S&T)",
            "work_type": "Kavach Trackside Balise Health Audit",
            "track_section": "Track 1: UP Main (KM 145.000 to KM 150.000)",
            "requested_start_time": "23:00",
            "requested_end_time": "00:30",
            "priority": "HIGH",
            "conflict_tag": "INDEPENDENT_WINDOW",
            "id": "REQ-ST-112",
            "dept": "st",
            "deptCode": "ST",
            "deptName": "Signalling & Telecom (S&T)",
            "track": "Track 1 (UP Main)",
            "trackId": "track1",
            "asset": "SIL-4 Automated Telegram Logger",
            "startTime": "23:00",
            "endTime": "00:30",
            "durationMinutes": 90,
            "section": "Track 1 UP Main, Somna–Kulwa Section",
            "timestamp": "Today, 12:30 PM",
            "notes": "SIL-4 certified telegram transmission and stationary balise link testing."
        }
    ]

    # -------------------------------------------------------------------------
    # 2. GENERATE TIMETABLE (timetable.json)
    # -------------------------------------------------------------------------
    timetable = [
        # --- CRITICAL CONFLICT PASSENGER SERVICES (10:00 - 14:00 ON TRACK 2) ---
        {
            "train_id": "22436",
            "train_name": "Vande Bharat Express (NDLS -> BSB)",
            "type": "SUPERFAST_PASSENGER",
            "scheduled_arrival": "11:45",
            "scheduled_departure": "11:47",
            "default_track": "Track 2: DN Main",
            "recommended_bypass_track": "Track 4: DN Loop",
            "priority_rank": 1,
            "conflict_flag": True,
            "bypass_speed_limit_kmh": 30,
            "estimated_delay_mins": 4,
            "operator": "Northern / North Central Railway",
            "loco_type": "Vande Bharat Trainset (16-Coach)"
        },
        {
            "train_id": "12424",
            "train_name": "Dibrugarh Rajdhani Express (NDLS -> DBRG)",
            "type": "PREMIUM_RAJDHANI",
            "scheduled_arrival": "12:50",
            "scheduled_departure": "12:52",
            "default_track": "Track 2: DN Main",
            "recommended_bypass_track": "Track 4: DN Loop",
            "priority_rank": 1,
            "conflict_flag": True,
            "bypass_speed_limit_kmh": 30,
            "estimated_delay_mins": 5,
            "operator": "Northern Railway",
            "loco_type": "WAP-7 / 22-Coach LHB Rake"
        },

        # --- SECONDARY CONFLICT PASSENGER SERVICE (02:00 - 05:00 ON TRACK 1) ---
        {
            "train_id": "12301",
            "train_name": "Howrah Rajdhani Express (HWH -> NDLS)",
            "type": "PREMIUM_RAJDHANI",
            "scheduled_arrival": "03:15",
            "scheduled_departure": "03:17",
            "default_track": "Track 1: UP Main",
            "recommended_bypass_track": "Track 3: UP Loop",
            "priority_rank": 1,
            "conflict_flag": True,
            "bypass_speed_limit_kmh": 30,
            "estimated_delay_mins": 3,
            "operator": "Eastern Railway",
            "loco_type": "WAP-7"
        },

        # --- FREIGHT RAKES (CONTAINER & BULK) ---
        {
            "train_id": "CONT-4821",
            "train_name": "CONCOR Container Rake (TKD -> DDU)",
            "type": "FREIGHT_CONTAINER",
            "scheduled_arrival": "04:10",
            "scheduled_departure": "04:30",
            "default_track": "Track 3: UP Loop",
            "recommended_bypass_track": "Track 3: UP Loop",
            "priority_rank": 4,
            "conflict_flag": False,
            "bypass_speed_limit_kmh": 75,
            "estimated_delay_mins": 0,
            "operator": "Container Corporation of India",
            "loco_type": "Twin WAG-9HC"
        },
        {
            "train_id": "BCN-9842",
            "train_name": "BCNHL Cement Rake (Chanderiya -> PRYJ)",
            "type": "FREIGHT_BULK",
            "scheduled_arrival": "10:30",
            "scheduled_departure": "10:55",
            "default_track": "Track 4: DN Loop",
            "recommended_bypass_track": "Track 4: DN Loop",
            "priority_rank": 5,
            "conflict_flag": False,
            "bypass_speed_limit_kmh": 60,
            "estimated_delay_mins": 0,
            "operator": "North Central Railway Goods Division",
            "loco_type": "WAG-9"
        },
        {
            "train_id": "BOXN-7731",
            "train_name": "BOXN Heavy Coal Rake (Dhanbad -> Dadri Power Plant)",
            "type": "FREIGHT_HEAVY_HAUL",
            "scheduled_arrival": "13:15",
            "scheduled_departure": "13:45",
            "default_track": "Track 4: DN Loop",
            "recommended_bypass_track": "Track 4: DN Loop",
            "priority_rank": 4,
            "conflict_flag": False,
            "bypass_speed_limit_kmh": 50,
            "estimated_delay_mins": 0,
            "operator": "East Central Railway Goods",
            "loco_type": "WAG-12B (12,000 HP)"
        },

        # --- NOMINAL 24-HOUR CORRIDOR THROUGH-TRAFFIC (NO CONFLICT) ---
        {
            "train_id": "12560",
            "train_name": "Shiv Ganga Express (NDLS -> BSBS)",
            "type": "SUPERFAST_EXPRESS",
            "scheduled_arrival": "01:10",
            "scheduled_departure": "01:12",
            "default_track": "Track 1: UP Main",
            "recommended_bypass_track": "Track 1: UP Main",
            "priority_rank": 2,
            "conflict_flag": False,
            "bypass_speed_limit_kmh": 130,
            "estimated_delay_mins": 0,
            "operator": "North Eastern Railway",
            "loco_type": "WAP-7"
        },
        {
            "train_id": "12418",
            "train_name": "Prayagraj Express (NDLS -> PRYJ)",
            "type": "SUPERFAST_EXPRESS",
            "scheduled_arrival": "07:00",
            "scheduled_departure": "07:05",
            "default_track": "Track 1: UP Main",
            "recommended_bypass_track": "Track 1: UP Main",
            "priority_rank": 2,
            "conflict_flag": False,
            "bypass_speed_limit_kmh": 130,
            "estimated_delay_mins": 0,
            "operator": "North Central Railway",
            "loco_type": "WAP-7"
        },
        {
            "train_id": "12802",
            "train_name": "Purushottam Express (NDLS -> PURI)",
            "type": "SUPERFAST_EXPRESS",
            "scheduled_arrival": "08:30",
            "scheduled_departure": "08:32",
            "default_track": "Track 2: DN Main",
            "recommended_bypass_track": "Track 2: DN Main",
            "priority_rank": 2,
            "conflict_flag": False,
            "bypass_speed_limit_kmh": 130,
            "estimated_delay_mins": 0,
            "operator": "East Coast Railway",
            "loco_type": "WAP-7"
        },
        {
            "train_id": "12314",
            "train_name": "Sealdah Rajdhani Express (NDLS -> SDAH)",
            "type": "PREMIUM_RAJDHANI",
            "scheduled_arrival": "09:40",
            "scheduled_departure": "09:42",
            "default_track": "Track 2: DN Main",
            "recommended_bypass_track": "Track 2: DN Main",
            "priority_rank": 1,
            "conflict_flag": False,
            "bypass_speed_limit_kmh": 130,
            "estimated_delay_mins": 0,
            "operator": "Eastern Railway",
            "loco_type": "WAP-7"
        },
        {
            "train_id": "22435",
            "train_name": "Vande Bharat Express (BSB -> NDLS)",
            "type": "SUPERFAST_PASSENGER",
            "scheduled_arrival": "14:15",
            "scheduled_departure": "14:17",
            "default_track": "Track 1: UP Main",
            "recommended_bypass_track": "Track 1: UP Main",
            "priority_rank": 1,
            "conflict_flag": False,
            "bypass_speed_limit_kmh": 130,
            "estimated_delay_mins": 0,
            "operator": "Northern / North Central Railway",
            "loco_type": "Vande Bharat Trainset"
        },
        {
            "train_id": "12276",
            "train_name": "Prayagraj–New Delhi Humsafar Express",
            "type": "HUMSAFAR_EXPRESS",
            "scheduled_arrival": "15:20",
            "scheduled_departure": "15:22",
            "default_track": "Track 2: DN Main",
            "recommended_bypass_track": "Track 2: DN Main",
            "priority_rank": 2,
            "conflict_flag": False,
            "bypass_speed_limit_kmh": 130,
            "estimated_delay_mins": 0,
            "operator": "North Central Railway",
            "loco_type": "WAP-7"
        },
        {
            "train_id": "12304",
            "train_name": "Poorva Express (NDLS -> HWH)",
            "type": "SUPERFAST_EXPRESS",
            "scheduled_arrival": "17:45",
            "scheduled_departure": "17:50",
            "default_track": "Track 2: DN Main",
            "recommended_bypass_track": "Track 2: DN Main",
            "priority_rank": 2,
            "conflict_flag": False,
            "bypass_speed_limit_kmh": 130,
            "estimated_delay_mins": 0,
            "operator": "Eastern Railway",
            "loco_type": "WAP-7"
        },
        {
            "train_id": "12582",
            "train_name": "Banaras Superfast Express (NDLS -> BSBS)",
            "type": "SUPERFAST_EXPRESS",
            "scheduled_arrival": "19:30",
            "scheduled_departure": "19:32",
            "default_track": "Track 1: UP Main",
            "recommended_bypass_track": "Track 1: UP Main",
            "priority_rank": 2,
            "conflict_flag": False,
            "bypass_speed_limit_kmh": 130,
            "estimated_delay_mins": 0,
            "operator": "North Eastern Railway",
            "loco_type": "WAP-7"
        },
        {
            "train_id": "14218",
            "train_name": "Unchahar Express (CDG -> PYGS)",
            "type": "MAIL_EXPRESS",
            "scheduled_arrival": "20:45",
            "scheduled_departure": "20:50",
            "default_track": "Track 2: DN Main",
            "recommended_bypass_track": "Track 2: DN Main",
            "priority_rank": 3,
            "conflict_flag": False,
            "bypass_speed_limit_kmh": 110,
            "estimated_delay_mins": 0,
            "operator": "Northern Railway",
            "loco_type": "WAP-4"
        },
        {
            "train_id": "12398",
            "train_name": "Mahabodhi Express (NDLS -> GAYA)",
            "type": "SUPERFAST_EXPRESS",
            "scheduled_arrival": "22:10",
            "scheduled_departure": "22:12",
            "default_track": "Track 1: UP Main",
            "recommended_bypass_track": "Track 1: UP Main",
            "priority_rank": 2,
            "conflict_flag": False,
            "bypass_speed_limit_kmh": 130,
            "estimated_delay_mins": 0,
            "operator": "East Central Railway",
            "loco_type": "WAP-7"
        },
        {
            "train_id": "12402",
            "train_name": "Magadh Express (NDLS -> IPR)",
            "type": "SUPERFAST_EXPRESS",
            "scheduled_arrival": "23:40",
            "scheduled_departure": "23:45",
            "default_track": "Track 2: DN Main",
            "recommended_bypass_track": "Track 2: DN Main",
            "priority_rank": 2,
            "conflict_flag": False,
            "bypass_speed_limit_kmh": 130,
            "estimated_delay_mins": 0,
            "operator": "East Central Railway",
            "loco_type": "WAP-7"
        }
    ]

    # Save to backend/
    backend_req_path = os.path.join(script_dir, "requisitions.json")
    backend_tt_path = os.path.join(script_dir, "timetable.json")
    with open(backend_req_path, "w", encoding="utf-8") as f:
        json.dump(requisitions, f, indent=2)
    with open(backend_tt_path, "w", encoding="utf-8") as f:
        json.dump(timetable, f, indent=2)

    # Save to src/data/ (for frontend integration)
    frontend_req_path = os.path.join(src_data_dir, "mockRequisitions.json")
    frontend_tt_path = os.path.join(src_data_dir, "mockTimetable.json")
    with open(frontend_req_path, "w", encoding="utf-8") as f:
        json.dump(requisitions, f, indent=2)
    with open(frontend_tt_path, "w", encoding="utf-8") as f:
        json.dump(timetable, f, indent=2)

    print(f"Generated {len(requisitions)} requisitions:")
    print(f" - {backend_req_path}")
    print(f" - {frontend_req_path}")
    print(f"Generated {len(timetable)} timetable entries:")
    print(f" - {backend_tt_path}")
    print(f" - {frontend_tt_path}")

if __name__ == "__main__":
    generate_datasets()
