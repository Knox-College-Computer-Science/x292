# backend/app/services/clinical_api.py

import requests
from typing import Optional

BASE_URL = "https://clinicaltrials.gov/api/v2/studies"

def fetch_trials(condition: str, location: Optional[str] = None, page_size: int = 20):
    """Fetch trials with all necessary fields for matching"""
    params = {
    "query.cond": condition,
    "pageSize": page_size,
    }
    
    if location:
        params["query.locn"] = location
    
    response = requests.get(BASE_URL, params=params)
    response.raise_for_status()
    return response.json()


#Just to test
#if __name__ == "__main__":
#    data = fetch_trials("diabetes")
#    print(data)