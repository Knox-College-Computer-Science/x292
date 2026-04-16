#takes one raw study from the API and turns it into a smaller, simpler version.

def clean_trial(study: dict):
    protocol = study.get("protocolSection", {})
    identification = protocol.get("identificationModule", {})
    status = protocol.get("statusModule", {})

    return {
        "nct_id": identification.get("nctId"),
        "title": identification.get("briefTitle"),
        "status": status.get("overallStatus")
    }