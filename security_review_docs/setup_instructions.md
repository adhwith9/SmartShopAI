# Security Review Setup & Execution Instructions

This guide provides step-by-step setup instructions for executing the automated security reviews locally and integrating them into the CI/CD pipeline.

---

## 1. Local Execution & Environment Setup

The orchestrator script `scripts/security_audit.py` runs SAST, dependency audits, and active API testing. To execute this script locally, follow these steps:

### Step A: Start the Backend Application Server
For active API testing, the backend server must be running on your local machine.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate your virtual environment:
   ```bash
   source .venv/bin/python
   ```
3. Run the database seed and launch the server on port `5001`:
   ```bash
   FLASK_ENV=development PORT=5001 python run.py
   ```

### Step B: Install Scan Tools in your Python Environment
The orchestrator relies on `bandit`, `pip-audit`, and `openpyxl`. Install these packages in your active environment:
```bash
python -m pip install openpyxl bandit pip-audit
```

### Step C: Execute the Security Scan
1. Open a new terminal window at the repository root.
2. Run the orchestrator:
   ```bash
   python scripts/security_audit.py
   ```
3. The script will automatically:
   - Identify active technologies (Python).
   - Perform static checks on backend code via Bandit.
   - Review dependency risks via pip-audit.
   - Probe HTTP endpoints at `http://localhost:5001` for security configurations.
   - Output structured findings.

---

## 2. Interpreting Generated Reports

After scan execution, you will find reports saved in the `Test Results/Security/` folder:

1. **HTML Dashboard (`security-report.html`)**:
   - An interactive premium dashboard utilizing glassmorphism styles.
   - Allows search filtering and quick toggles between severity levels.
   - Provides descriptions, target code lines, and remediation tips.
2. **Excel Registry (`Security_Vulnerability_Report.xlsx`)**:
   - A professionally styled spreadsheet using Google-style metrics.
   - Sheet 1 contains high-level KPIs and severity totals.
   - Sheet 2 contains a detailed vulnerability register with cell-highlighted severity tags.
3. **Markdown Summary (`security-summary.md`)**:
   - A concise markdown document designed to display scan outcomes inside the GitHub Action run dashboard.
4. **JSON Export (`security-report.json`)**:
   - Raw JSON structure containing all findings, ideal for integration with security monitoring pipelines (SIEM) or webhook logs.

---

## 3. GitHub Actions CI/CD Integration

The workflow [.github/workflows/security-review.yml](file:///Users/charanreddy/Desktop/smartshop-ai/.github/workflows/security-review.yml) automatically runs the security review suite on every code push, pull request, and manual execution dispatch.

### Pipeline Flow:
1. **Runner Provisioning**: Bootstraps an `ubuntu-latest` VM.
2. **Checkout**: Pulls the active branch code.
3. **Environments Setup**: Configures Node.js and Python.
4. **Dependencies Resolution**: Restores caches, installs requirements, and adds scan engines (`bandit`, `pip-audit`, `openpyxl`).
5. **Daemon Launch**: Launches the Flask app in the background.
6. **Connection Hold**: Blocks steps until `npx wait-on` confirms port `5001/api/health` is online.
7. **Security Execute**: Triggers `python scripts/security_audit.py`.
8. **Artifact Upload**: Packages and uploads the `Test Results/Security/` reports directory.
9. **Summary Injection**: appends the Markdown findings registry to the GitHub Actions Job Run Summary.

### Fail-Safe Policy:
The pipeline uses an exit-code evaluator. The build will **FAIL** (throwing exit status `1` and blocking pull request mergers) **ONLY** if one or more **Critical** severity vulnerabilities are discovered. Low, Medium, and High issues are logged and reported but will not break the build.
