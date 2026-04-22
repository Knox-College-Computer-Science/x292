#takes one raw study from the API and turns it into a smaller, simpler version.
# backend/app/services/cleaner.py

from typing import Optional, List, Dict

def clean_trial(study: dict) -> Dict:
    """Transform raw ClinicalTrials.gov response into clean structure"""
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
    compensation = _extract_compensation(protocol)

    return {
        "nct_id": identification.get("nctId"),
        "title": identification.get("briefTitle"),
        "condition": ", ".join(conditions.get("conditions", [])) if conditions.get("conditions") else "",
        "location": locations[0] if locations else "Not provided",
        "study_type": design.get("studyType"),
        "study_description": description.get("briefSummary"),
        "study_phase": design.get("phases", [None])[0] if design.get("phases") else None,
        "recruitment_status": status.get("overallStatus", "Unknown"),
        "compensation": compensation,
        "eligibility_summary": eligibility.get("eligibilityCriteria"),
        "sponsor": sponsor.get("leadSponsor", {}).get("name") if sponsor.get("leadSponsor") else None,
    }


def _extract_locations(contacts: dict) -> List[str]:
    """Extract city, state, country from contact/location info"""
    locations = []

    for facility in contacts.get("locations", []):
        city = facility.get("city", "")
        state = facility.get("state", "")
        country = facility.get("country", "")
        loc_str = ", ".join(filter(None, [city, state, country]))
        if loc_str:
            locations.append(loc_str)

    return list(set(locations))


def _extract_compensation(protocol: dict) -> Optional[str]:
    """Extract compensation info if available"""
    comp_module = protocol.get("compensationModule", {})

    comp_type = comp_module.get("compensationType")
    comp_amount = comp_module.get("amount")

    if comp_type and comp_amount:
        return f"{comp_type}: ${comp_amount}"
    if comp_type:
        return comp_type

    return None
