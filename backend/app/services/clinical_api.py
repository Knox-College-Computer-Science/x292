import requests

BASE_URL = "https://clinicaltrials.gov/api/v2/studies"

#To fetch data From the website

def fetch_trials(condition: str, page_size: int = 5):
    params = {
        "query.cond": condition,
        "pageSize": page_size,
        "fields": "NCTId,BriefTitle,OverallStatus"
    }

    response = requests.get(BASE_URL, params=params)
    response.raise_for_status()
    return response.json()


#Just to test
#if __name__ == "__main__":
#    data = fetch_trials("diabetes")
#    print(data)