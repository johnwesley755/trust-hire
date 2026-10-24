import re
from typing import Optional

def normalize_company(company_name: str) -> str:
    """
    Normalizes company name by stripping common corporate suffixes and punctuation.
    Mirrors node-backend/src/services/jobDeduplicationService.ts for 100% hash parity.
    """
    if not company_name:
        return ""
    cleaned = re.sub(
        r"\b(pvt\.?|private|ltd\.?|limited|llc|corp\.?|corporation|inc\.?|services|technologies|solutions)\b",
        "",
        company_name,
        flags=re.IGNORECASE,
    )
    cleaned = re.sub(r"[^a-zA-Z0-9]", "", cleaned)
    return cleaned.lower().strip()


def normalize_title(title: str) -> str:
    """
    Normalizes title by removing noisy recruiter buzzwords and special characters.
    """
    if not title:
        return ""
    cleaned = re.sub(
        r"\b(urgently\s+hiring|urgent|immediate\s+joiner|immediate|walk-in|walkin|wanted|required|requirement|fresher|experienced)\b",
        "",
        title,
        flags=re.IGNORECASE,
    )
    cleaned = re.sub(r"[^a-zA-Z0-9\s]", " ", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned.lower().strip()


def normalize_city(city: str) -> str:
    """Normalizes Indian city names (e.g. Bangalore -> Bengaluru, Madras -> Chennai)."""
    if not city:
        return "Chennai"
    c = city.lower().strip()
    if "bangalore" in c:
        return "Bengaluru"
    if "madras" in c:
        return "Chennai"
    if "bombay" in c:
        return "Mumbai"
    if "calcutta" in c:
        return "Kolkata"
    return city.strip().title()


def get_salary_bracket(salary_min: Optional[float], salary_max: Optional[float]) -> str:
    """
    Categorizes salary into standard compensation brackets.
    """
    s_min = salary_min or 0.0
    s_max = salary_max or 0.0
    avg = (s_min + s_max) / 2.0 if s_min > 0 and s_max > 0 else (s_min or s_max)

    if avg <= 0:
        return "unspecified"
    if avg < 15000:
        return "under-15k"
    if avg <= 25000:
        return "15k-25k"
    if avg <= 40000:
        return "25k-40k"
    if avg <= 60000:
        return "40k-60k"
    return "60k-plus"
