import re
from typing import Tuple, Optional
from app.models.schemas import RawJobRecord
from app.extractors.classifier import BlueCollarClassifier

BANNED_COMPANIES = [
    r"^confidential$", r"^hiring$", r"^hiring\s+company$", r"^employer$",
    r"^direct\s+employer$", r"^urgent\s+hiring$", r"^immediate\s+requirement$",
    r"^consultancy$", r"^placement\s+agency$", r"^unknown$", r"^dummy$",
    r"^test\s+company$"
]

BANNED_TITLES = [
    r"lorem\s+ipsum", r"^test(\s+job)?$", r"^sample(\s+job)?$",
    r"^urgent\s+requirement$", r"^job\s+opening$", r"^various\s+positions$"
]

compiled_banned_companies = [re.compile(p, re.IGNORECASE) for p in BANNED_COMPANIES]
compiled_banned_titles = [re.compile(p, re.IGNORECASE) for p in BANNED_TITLES]


def validate_job_quality(job: RawJobRecord) -> Tuple[bool, Optional[str]]:
    """
    Evaluates a candidate external job against completeness, legitimacy,
    and strict blue-collar role qualification.
    """
    # 1. Title verification
    title = (job.title or "").strip()
    if len(title) < 3:
        return False, "Job title is too short or missing."

    for pattern in compiled_banned_titles:
        if pattern.search(title):
            return False, f"Job title matches placeholder pattern: '{title}'."

    # 2. Company verification
    company = (job.company_name or "").strip()
    if len(company) < 2:
        return False, "Employer company name is missing or too short."

    for pattern in compiled_banned_companies:
        if pattern.search(company):
            return False, f"Employer matches generic/dummy pattern: '{company}'."

    # 3. Source URL verification
    if not job.source_url or not (job.source_url.startswith("http://") or job.source_url.startswith("https://")):
        return False, "Invalid or missing source URL."

    # 4. Blue-Collar Role Classification
    is_blue_collar, reject_reason = BlueCollarClassifier.evaluate(job.title, job.description)
    if not is_blue_collar:
        return False, reject_reason

    return True, None
