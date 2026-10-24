import re
from typing import Tuple, Optional

# White-collar terms that trigger immediate rejection
WHITE_COLLAR_PATTERNS = [
    # Tech & Software Engineering
    r"\bsoftware\b", r"\bdeveloper\b", r"\bengineer\b", r"\bdevops\b", r"\bqa\s+tester\b",
    r"\bfullstack\b", r"\bbackend\b", r"\bfrontend\b", r"\bpython\b", r"\bjava\b", r"\breact\b",
    r"\bgolang\b", r"\bdata\s+scientist\b", r"\bdata\s+analyst\b", r"\bai/ml\b", r"\bmachine\s+learning\b",
    r"\bsystem\s+architect\b", r"\bcloud\s+architect\b", r"\bdatabase\s+administrator\b",
    # Management, Corporate & Executive
    r"\bproduct\s+manager\b", r"\bproject\s+manager\b", r"\bscrum\s+master\b", r"\bdirector\b",
    r"\bvice\s+president\b", r"\bvp\b", r"\bceo\b", r"\bcto\b", r"\bcfo\b", r"\bchief\b",
    r"\bgeneral\s+manager\b", r"\bmanagement\s+consultant\b", r"\bprogram\s+manager\b",
    # HR, Talent & Recruiting
    r"\bhuman\s+resources\b", r"\bhr\s+manager\b", r"\btalent\s+acquisition\b", r"\brecruiter\b",
    # Finance, Accounting & Legal
    r"\bchartered\s+accountant\b", r"\baccountant\b", r"\bfinancial\s+analyst\b", r"\bauditor\b",
    r"\blegal\s+counsel\b", r"\blawyer\b", r"\badvocate\b",
    # Marketing, Content & Design
    r"\bmarketing\s+manager\b", r"\bdigital\s+marketing\b", r"\bseo\s+specialist\b", r"\bcontent\s+writer\b",
    r"\bcopywriter\b", r"\bgraphic\s+designer\b", r"\bui/ux\b", r"\bui\s+designer\b",
    # B2B Sales & Enterprise
    r"\baccount\s+executive\b", r"\bbusiness\s+development\s+manager\b", r"\benterprise\s+sales\b"
]

# Blue-collar terms that qualify candidate jobs
BLUE_COLLAR_PATTERNS = [
    # Logistics, Delivery & Driving
    r"\bdelivery\b", r"\brider\b", r"\bcourier\b", r"\bboy\b", r"\bdriver\b", r"\bchauffeur\b",
    r"\bvan\s+driver\b", r"\btruck\s+driver\b", r"\bauto\s+driver\b", r"\bforklift\b",
    # Warehouse, Factory & Manual
    r"\bwarehouse\b", r"\bpicker\b", r"\bpacker\b", r"\bloader\b", r"\bunloader\b", r"\bsorter\b",
    r"\binventory\s+assistant\b", r"\bmaterial\s+handler\b", r"\bfactory\s+worker\b", r"\blabour\b", r"\blaborer\b",
    # Security, Facility & Hospitality
    r"\bsecurity\b", r"\bguard\b", r"\bwatchman\b", r"\bpatrol\b", r"\bbouncer\b",
    r"\bhousekeeping\b", r"\bcleaner\b", r"\bjanitor\b", r"\boffice\s+boy\b", r"\bpeon\b",
    r"\bcook\b", r"\bchef\s+helper\b", r"\bkitchen\s+steward\b", r"\bwaiter\b", r"\bsteward\b",
    # Skilled Trades & Field Services
    r"\belectrician\b", r"\bplumber\b", r"\bcarpenter\b", r"\bwelder\b", r"\bpainter\b",
    r"\bmason\b", r"\bfitter\b", r"\btailor\b", r"\bmechanic\b", r"\btechnician\b",
    r"\bappliance\s+repair\b", r"\bac\s+technician\b", r"\bcctv\s+technician\b",
    # Construction & Site
    r"\bconstruction\b", r"\bscaffolder\b", r"\bsite\s+worker\b", r"\bhelper\b"
]

compiled_white_collar = [re.compile(p, re.IGNORECASE) for p in WHITE_COLLAR_PATTERNS]
compiled_blue_collar = [re.compile(p, re.IGNORECASE) for p in BLUE_COLLAR_PATTERNS]


class BlueCollarClassifier:
    """
    Strict classifier ensuring ONLY genuine blue-collar jobs are approved,
    and white-collar / office jobs are systematically rejected.
    """

    @classmethod
    def evaluate(cls, title: str, description: Optional[str] = None) -> Tuple[bool, Optional[str]]:
        text_to_check = f"{title} {description or ''}".lower()

        # 1. Check for immediate white-collar disqualifiers
        for pattern in compiled_white_collar:
            if pattern.search(title.lower()):
                return False, f"Rejected: matched white-collar pattern '{pattern.pattern}' in title"

        if description:
            # Check opening 500 characters of description for overt white-collar disqualifiers
            desc_head = description.lower()[:500]
            for pattern in compiled_white_collar:
                if pattern.search(desc_head):
                    return False, f"Rejected: matched white-collar pattern '{pattern.pattern}' in description"

        # 2. Check for positive blue-collar qualification
        has_blue_collar_match = any(p.search(title.lower()) for p in compiled_blue_collar)
        if not has_blue_collar_match and description:
            has_blue_collar_match = any(p.search(text_to_check) for p in compiled_blue_collar)

        if not has_blue_collar_match:
            return False, "Rejected: does not match any recognized blue-collar role keywords"

        return True, None
