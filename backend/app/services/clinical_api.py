import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from typing import Optional

BASE_URL = "https://clinicaltrials.gov/api/v2/studies"


_session = requests.Session()
_retry = Retry(
    total=2,
    backoff_factor=0.6,
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["GET"],
)
_session.mount("https://", HTTPAdapter(max_retries=_retry))


def fetch_trials(condition: str, location: Optional[str] = None, page_size: int = 20):
    params = {
        "query.cond": condition,
        "pageSize": page_size,
        "countTotal": "true",
    }

    if location:
        params["query.locn"] = location

    response = _session.get(BASE_URL, params=params, timeout=15)
    response.raise_for_status()
    return response.json()
