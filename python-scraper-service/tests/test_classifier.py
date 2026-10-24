import pytest
from app.extractors.classifier import BlueCollarClassifier

def test_accepts_delivery_rider():
    is_valid, reason = BlueCollarClassifier.evaluate("Delivery Partner / Rider - Chennai", "Need bike and driving license")
    assert is_valid is True
    assert reason is None

def test_accepts_warehouse_packer():
    is_valid, reason = BlueCollarClassifier.evaluate("Warehouse Associate & Packer", "Picking, packing, and sorting packages")
    assert is_valid is True
    assert reason is None

def test_accepts_electrician():
    is_valid, reason = BlueCollarClassifier.evaluate("Maintenance Electrician - Industrial Unit", "ITI certificate required")
    assert is_valid is True
    assert reason is None

def test_accepts_security_guard():
    is_valid, reason = BlueCollarClassifier.evaluate("Security Guard (Day/Night Shift)")
    assert is_valid is True
    assert reason is None

def test_accepts_housekeeping():
    is_valid, reason = BlueCollarClassifier.evaluate("Housekeeping Staff - Hotel")
    assert is_valid is True
    assert reason is None

def test_rejects_software_engineer():
    is_valid, reason = BlueCollarClassifier.evaluate("Senior Software Engineer (React / Node.js)")
    assert is_valid is False
    assert "white-collar" in reason.lower()

def test_rejects_product_manager():
    is_valid, reason = BlueCollarClassifier.evaluate("Associate Product Manager")
    assert is_valid is False
    assert "white-collar" in reason.lower()

def test_rejects_hr_recruiter():
    is_valid, reason = BlueCollarClassifier.evaluate("HR Recruiter - Talent Acquisition")
    assert is_valid is False
    assert "white-collar" in reason.lower()

def test_rejects_accountant():
    is_valid, reason = BlueCollarClassifier.evaluate("Chartered Accountant / Financial Analyst")
    assert is_valid is False
    assert "white-collar" in reason.lower()

def test_rejects_vague_unrecognized_role():
    is_valid, reason = BlueCollarClassifier.evaluate("Strategic Evangelist Specialist")
    assert is_valid is False
    assert "does not match" in reason.lower()
