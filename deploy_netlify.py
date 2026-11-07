"""
Automated deployment script for Netlify via REST API.
Usage:
    python deploy_netlify.py <NETLIFY_AUTH_TOKEN> [site_name]
"""
import sys
import os
import urllib.request
import urllib.error
import json
import zipfile

def create_zip():
    zip_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "diwali-greeting.zip")
    files = ['index.html', 'app.js', 'styles.css', 'README.md']
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for f in files:
            p = os.path.join(os.path.dirname(os.path.abspath(__file__)), f)
            if os.path.exists(p):
                zipf.write(p, arcname=f)
    return zip_path

def deploy_to_netlify(token, site_name=None):
    zip_path = create_zip()
    with open(zip_path, "rb") as f:
        zip_data = f.read()

    url = "https://api.netlify.com/api/v1/sites"
    if site_name:
        url += f"?name={site_name}"

    req = urllib.request.Request(
        url,
        data=zip_data,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/zip",
            "User-Agent": "DiwaliCardDeployer/1.0"
        },
        method="POST"
    )

    try:
        print("Uploading diwali-greeting.zip to Netlify...")
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            live_url = data.get("ssl_url") or data.get("url")
            admin_url = data.get("admin_url")
            print("\n🎉 Successfully deployed to Netlify!")
            print(f"👉 Live Website: {live_url}")
            print(f"👉 Personalized Card Link: {live_url}/?view=card&from=Aarav&to=Priya%20%26%20Family")
            print(f"👉 Admin Dashboard:    {admin_url}")
            return live_url
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        print(f"Netlify API Error ({e.code}): {err_body}")
        return None
    except Exception as e:
        print(f"Deploy error: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python deploy_netlify.py <NETLIFY_AUTH_TOKEN> [site_name]")
        sys.exit(1)
    tok = sys.argv[1]
    name = sys.argv[2] if len(sys.argv) > 2 else None
    deploy_to_netlify(tok, name)
