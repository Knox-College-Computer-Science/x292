from app.services.clinical_api import fetch_trials
from app.services.cleaner import clean_trial


data = fetch_trials("diabetes")
studies = data.get("studies", [])

print("Number of studies fetched:", len(studies))

for study in studies:
    cleaned = clean_trial(study)
    print(cleaned)