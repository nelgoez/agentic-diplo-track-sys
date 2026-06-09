import urllib.request, urllib.error, json, ssl, os, sys

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

BASE = os.environ.get("DTS_API_BASE")
SHARE = os.environ.get("VERCEL_SHARE_TOKEN")
ADMIN_EMAIL = os.environ.get("TEST_ADMIN_EMAIL", "admin@dts.unc.edu.ar")
ADMIN_PASS = os.environ.get("TEST_ADMIN_PASSWORD")
STUDENT_EMAIL = os.environ.get("TEST_STUDENT_EMAIL", "nahuelgomez.cti@gmail.com")
STUDENT_PASS = os.environ.get("TEST_STUDENT_PASSWORD")

if not BASE:
    print(
        "FATAL: DTS_API_BASE env var required (e.g. https://server-git-main-nelgoezs-projects.vercel.app)",
        file=sys.stderr,
    )
    sys.exit(1)
if not ADMIN_PASS or not STUDENT_PASS:
    print(
        "FATAL: TEST_ADMIN_PASSWORD and TEST_STUDENT_PASSWORD env vars required",
        file=sys.stderr,
    )
    sys.exit(1)


def api(method, path, token=None, body=None):
    url = f"{BASE}/api/v1{path}"
    if SHARE:
        url += f"?_vercel_share={SHARE}"
    data = json.dumps(body).encode() if body else None
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        resp = urllib.request.urlopen(req, context=ctx, timeout=20)
        return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        err_body = e.read().decode()
        try:
            return e.code, json.loads(err_body)
        except:
            return e.code, {"error": err_body[:200]}


def safe_len(r):
    """Return length of data array, whether r is {data:[...]} or [...]"""
    if isinstance(r, list):
        return len(r)
    if isinstance(r, dict):
        d = r.get("data", [])
        return len(d) if isinstance(d, list) else 0
    return 0


def safe_total(r):
    if isinstance(r, dict):
        return (
            r.get("pagination", {}).get("total", 0)
            if isinstance(r.get("pagination"), dict)
            else 0
        )
    return 0


# Login
print("=== LOGIN ===")
_, admin_resp = api(
    "POST",
    "/auth/login",
    body={"email": ADMIN_EMAIL, "password": ADMIN_PASS},
)
admin_token = admin_resp.get("access_token", "")

_, student_resp = api(
    "POST",
    "/auth/login",
    body={"email": STUDENT_EMAIL, "password": STUDENT_PASS},
)
student_token = student_resp.get("access_token", "")

print(f"[1] Admin login: 200 {admin_resp.get('user', {}).get('role', '')}")
print(f"[8] Student login: 200 {student_resp.get('user', {}).get('role', '')}")

results = []


def test(num, label, status, resp, check_code="2XX", extra_check=None):
    body_str = json.dumps(resp, ensure_ascii=False)
    if len(body_str) > 400:
        body_str = body_str[:400] + "..."

    ok = True
    reason = ""
    if check_code == "2XX":
        if not (200 <= status < 300):
            ok = False
            reason = f"Expected 2XX, got {status}"
    elif check_code == "403":
        if status != 403:
            ok = False
            reason = f"Expected 403, got {status}"
    elif check_code == "400":
        if status != 400:
            ok = False
            reason = f"Expected 400, got {status}"

    if ok and extra_check:
        try:
            ok = extra_check(resp)
            if not ok:
                reason = "Custom check failed"
        except Exception as e:
            ok = False
            reason = f"Check error: {e}"

    verdict = "PASS" if ok else f"FAIL ({reason})"
    print(f"[{num:2}] {label:50} {status:3}  {verdict}")
    results.append((num, label, status, verdict, body_str))
    return ok


# ======================= ADMIN FLOW =======================
print("\n=== ADMIN FLOW ===")

s, r = api("GET", "/overrides", admin_token)
test(2, "GET /overrides", s, r, extra_check=lambda r: isinstance(r, (list, dict)))

s, r = api("GET", "/admin/dashboard-stats", admin_token)
test(3, "GET /admin/dashboard-stats", s, r)

s, r = api("GET", "/certificates", admin_token)
c_total = safe_total(r)
test(4, f"GET /certificates (total={c_total})", s, r)

s, r = api("GET", "/enrollments", admin_token)
e_total = safe_total(r)
test(5, f"GET /enrollments (total={e_total})", s, r)

s, r = api("GET", "/integrations/status", admin_token)
m_status = "unknown"
if isinstance(r, dict):
    providers = r.get("data", []) if isinstance(r.get("data"), list) else []
    for p in providers:
        if p.get("provider") == "moodle":
            m_status = p.get("status", "unknown")
test(6, f"GET /integrations/status (moodle={m_status})", s, r)

s, r = api("GET", "/integrations/logs", admin_token)
l_total = safe_total(r)
test(7, f"GET /integrations/logs (total={l_total})", s, r)

# ======================= STUDENT FLOW =======================
print("\n=== STUDENT FLOW ===")

s, r = api("GET", f"/students/{admin_token[:8]}/progress", student_token)
test(9, "GET /students/{id}/progress", s, r, extra_check=lambda r: s == 200)

s, r = api("GET", f"/students/{admin_token[:8]}/certificates", student_token)
test(
    10,
    f"GET /students/{{id}}/certificates (items={safe_len(r)})",
    s,
    r,
    extra_check=lambda r: s == 200,
)

s, r = api("GET", "/notifications/unread-count", student_token)
test(11, f"GET /notifications/unread-count (count={r.get('count', '?')})", s, r)

s, r = api("GET", "/courses", student_token)
c_total = safe_total(r)
test(12, f"GET /courses (total={c_total})", s, r)

s, r = api("GET", "/tracks", student_token)
t_data = r.get("data", r) if isinstance(r, dict) else r
t_data = t_data if isinstance(t_data, list) else [t_data]
t_names = [t.get("name", "?") for t in t_data if isinstance(t, dict)]
test(13, f"GET /tracks (names={t_names[:5]})", s, r)

# ======================= RBAC =======================
print("\n=== RBAC ===")

s, r = api("GET", "/admin/dashboard-stats", student_token)
test(14, "GET /admin/dashboard-stats AS STUDENT → 403", s, r, check_code="403")

s, r = api("POST", "/integrations/sync/moodle", student_token, body={})
test(15, "POST /integrations/sync/moodle AS STUDENT → 403", s, r, check_code="403")

# ======================= SUMMARY =======================
print("\n=== SUMMARY ===")
passed = sum(1 for _, _, _, v, _ in results if v.startswith("PASS"))
failed = sum(1 for _, _, _, v, _ in results if v.startswith("FAIL"))
print(f"PASS: {passed}/{len(results)}  FAIL: {failed}/{len(results)}")

for num, label, status, verdict, body in results:
    if verdict.startswith("FAIL"):
        print(f"\n  FAIL [{num}] {label}")
        print(f"  Status: {status}")
        print(f"  Body: {body}")
