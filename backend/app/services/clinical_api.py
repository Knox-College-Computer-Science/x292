import requests
from typing import List, Optional, Dict
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class ClinicalTrialsAPI:
    BASE_URL = "https://clinicaltrials.gov/api/v2/studies"
    
    @staticmethod
    def search_trials(
        condition: Optional[str] = None,
        location: Optional[str] = None,
        status: str = "RECRUITING",
        page_size: int = 50
    ) -> List[Dict]:
        """Fetch trials from ClinicalTrials.gov API"""
        try:
            params = {
                "format": "json",
                "pageSize": page_size,
                "filter.overallStatus": status
            }
            
            if condition:
                params["query.cond"] = condition
            
            if location:
                params["query.locn"] = location
            
            response = requests.get(self.BASE_URL, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            studies = data.get("studies", [])
            
            return [self._parse_study(study) for study in studies]
            
        except requests.RequestException as e:
            logger.error(f"ClinicalTrials API error: {e}")
            return []
    
    @staticmethod
    def _parse_study(study: Dict) -> Dict:
        """Parse a study from API response into our format"""
        protocol = study.get("protocolSection", {})
        id_module = protocol.get("identificationModule", {})
        desc_module = protocol.get("descriptionModule", {})
        status_module = protocol.get("statusModule", {})
        sponsor_module = protocol.get("sponsorCollaboratorsModule", {})
        conditions_module = protocol.get("conditionsModule", {})
        design_module = protocol.get("designModule", {})
        eligibility_module = protocol.get("eligibilityModule", {})
        contacts_module = protocol.get("contactsLocationsModule", {})
        
        # Get first location if available
        locations = contacts_module.get("locations", [])
        location = locations[0] if locations else {}
        
        return {
            "nct_id": id_module.get("nctId", ""),
            "title": id_module.get("briefTitle", ""),
            "brief_summary": desc_module.get("briefSummary", ""),
            "detailed_description": desc_module.get("detailedDescription"),
            "condition": ", ".join(conditions_module.get("conditions", [])),
            "phase": design_module.get("phases", ["N/A"])[0] if design_module.get("phases") else None,
            "status": status_module.get("overallStatus", "UNKNOWN"),
            "sponsor": sponsor_module.get("leadSponsor", {}).get("name"),
            "location_city": location.get("city"),
            "location_state": location.get("state"),
            "location_country": location.get("country"),
            "location_facility": location.get("facility"),
            "latitude": location.get("geoPoint", {}).get("lat"),
            "longitude": location.get("geoPoint", {}).get("lon"),
            "min_age": self._parse_age(eligibility_module.get("minimumAge")),
            "max_age": self._parse_age(eligibility_module.get("maximumAge")),
            "gender": eligibility_module.get("sex"),
            "is_remote": "remote" in desc_module.get("briefSummary", "").lower(),
            "eligibility_criteria": eligibility_module.get("eligibilityCriteria"),
            "start_date": self._parse_date(status_module.get("startDateStruct")),
            "completion_date": self._parse_date(status_module.get("completionDateStruct")),
        }
    
    @staticmethod
    def _parse_age(age_str: Optional[str]) -> Optional[int]:
        """Parse age string like '18 Years' to integer"""
        if not age_str:
            return None
        try:
            return int(age_str.split()[0])
        except:
            return None
    
    @staticmethod
    def _parse_date(date_struct: Optional[Dict]) -> Optional[datetime]:
        """Parse date structure from API"""
        if not date_struct or not date_struct.get("date"):
            return None
        try:
            return datetime.strptime(date_struct["date"], "%Y-%m-%d")
        except:
            return None

clinical_api = ClinicalTrialsAPI()
