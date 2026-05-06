# Backend

FastAPI + SQLite API for the class project.

## Run

**Step 1: Create a virtual environment** (from the project root)

=== "macOS/Linux"

```bash
cd /path/to/x292
python3 -m venv .venv
```

=== "Windows"

```bash
cd C:\path\to\x292
python -m venv .venv
```

**Step 2: Activate the virtual environment**

=== "macOS/Linux"

```bash
source .venv/bin/activate
```

=== "Windows (Command Prompt)"

```bash
.venv\Scripts\activate
```

=== "Windows (PowerShell)"

```powershell
.venv\Scripts\Activate.ps1
```

**Step 3: Install dependencies**

=== "macOS/Linux"

```bash
cd backend
pip install -r requirements.txt
```

=== "Windows"

```bash
cd backend
pip install -r requirements.txt
```

**Step 4: Start the server**

```bash
uvicorn app.main:app --reload
```

You should see:

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

**Note (macOS only):** If you encounter Python compatibility issues, use Python 3.13:

```bash
deactivate
rm -rf .venv
python3.13 -m venv .venv
source .venv/bin/activate
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

```
