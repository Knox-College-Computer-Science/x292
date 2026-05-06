from typing import Dict, List, Optional


def clean_trial(study: dict) -> Dict:
    protocol = study.get("protocolSection", {})
    identification = protocol.get("identificationModule", {})
    status = protocol.get("statusModule", {})
    conditions = protocol.get("conditionsModule", {})
    contacts = protocol.get("contactsLocationsModule", {})
    eligibility = protocol.get("eligibilityModule", {})
    sponsor = protocol.get("sponsorCollaboratorsModule", {})
    design = protocol.get("designModule", {})
    description = protocol.get("descriptionModule", {})

    locations = _extract_locations(contacts)
    condition_list = conditions.get("conditions", [])
    condition_text = ", ".join(condition_list) if condition_list else "Unspecified"

    nct_id = identification.get("nctId")
    start_date = _extract_date(status.get("startDateStruct"))
    end_date = _extract_date(status.get("completionDateStruct"))

    eligibility_criteria = eligibility.get("eligibilityCriteria")

    return {
        "nct_id": nct_id,
        "title": identification.get("briefTitle") or "Untitled study",
        "condition": condition_text,
        "category": condition_list[0] if condition_list else "General",
        "location": locations[0] if locations else "Location not listed",
        "study_type": design.get("studyType"),
        "study_description": description.get("briefSummary")
        or description.get("detailedDescription")
        or "Description not provided",
        "study_phase": (design.get("phases") or [None])[0],
        "recruitment_status": status.get("overallStatus", "Unknown"),
        "compensation": _extract_compensation(protocol),
        "duration": _build_duration(start_date, end_date),
        "visit_frequency": "Not listed",
        "time_commitment": "Not listed",
        "start_date": start_date,
        "end_date": end_date,
        "eligibility_age_min": _parse_age(eligibility.get("minimumAge")),
        "eligibility_age_max": _parse_age(eligibility.get("maximumAge")),
        "eligibility_gender": eligibility.get("sex", "All"),
        "eligibility_conditions": condition_text,
        "eligibility_summary": eligibility_criteria,
        "remote_eligible": _is_remote_eligible(
            description.get("briefSummary"),
            description.get("detailedDescription"),
            locations,
        ),
        "sponsor": sponsor.get("leadSponsor", {}).get("name")
        if sponsor.get("leadSponsor")
        else None,
        "contact_link": f"https://clinicaltrials.gov/study/{nct_id}" if nct_id else None,
    }


def _extract_locations(contacts: dict) -> List[str]:
    locations = []

    for facility in contacts.get("locations", []):
        city = facility.get("city", "")
        state = facility.get("state", "")
        country = facility.get("country", "")
        loc_str = ", ".join(filter(None, [city, state, country]))
        if loc_str:
            locations.append(loc_str)

    return list(dict.fromkeys(locations))


def _extract_compensation(protocol: dict) -> Optional[str]:
    comp_module = protocol.get("compensationModule", {})

    comp_type = comp_module.get("compensationType")
    comp_amount = comp_module.get("amount")

    if comp_type and comp_amount:
        return f"{comp_type}: ${comp_amount}"
    if comp_type:
        return comp_type

    return None


def _extract_date(date_struct: Optional[dict]) -> Optional[str]:
    if not date_struct:
        return None
    return date_struct.get("date")


def _build_duration(start_date: Optional[str], end_date: Optional[str]) -> Optional[str]:
    if start_date and end_date:
        return f"{start_date} to {end_date}"
    return start_date or end_date


def _parse_age(age_text: Optional[str]) -> Optional[int]:
    if not age_text:
        return None

    first_token = age_text.strip().split(" ")[0]
    if first_token.isdigit():
        return int(first_token)
    return None


def _is_remote_eligible(
    brief_summary: Optional[str], detailed_description: Optional[str], locations: List[str]
) -> bool:
    haystack = " ".join(
        [
            brief_summary or "",
            detailed_description or "",
            " ".join(locations),
        ]
    ).lower()

    keywords = ["remote", "virtual", "telehealth", "at home", "home-based"]
    return any(keyword in haystack for keyword in keywords)
