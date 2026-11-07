"""
Automated deployment script to upload and publish to GitHub Pages via GitHub REST API.
Usage:
    python deploy_github.py <GITHUB_TOKEN> <GITHUB_USERNAME> <REPO_NAME>
"""
import os
import sys
import base64
import urllib.request
import json

def upload_file_to_github(token, owner, repo, local_path, github_path):
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{github_path}"
    with open(local_path, "rb") as f:
        content_b64 = base64.b64encode(f.read()).decode("utf-8")

    req = urllib.request.Request(url, headers={
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "DiwaliDeployer"
    })
    sha = None
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            sha = data.get("sha")
    except Exception:
        pass

    payload = {
        "message": f"Deploy {github_path} for Diwali Greeting App",
        "content": content_b64,
        "branch": "main"
    }
    if sha:
        payload["sha"] = sha

    req_put = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "DiwaliDeployer"
        },
        method="PUT"
    )
    try:
        with urllib.request.urlopen(req_put) as resp:
            return resp.status in (200, 201)
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8')
        print(f"Error uploading {github_path}: {e.code} - {err_msg}")
        return False
    except Exception as e:
        print(f"Error uploading {github_path}: {e}")
        return False

def enable_pages(token, owner, repo):
    url = f"https://api.github.com/repos/{owner}/{repo}/pages"
    payload = {
        "source": {
            "branch": "main",
            "path": "/"
        }
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "DiwaliDeployer"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            return data.get("html_url")
    except urllib.error.HTTPError as e:
        # If already enabled
        if e.code == 409:
            return f"https://{owner}.github.io/{repo}/"
        print(f"GitHub Pages notification ({e.code}): {e.read().decode()}")
        return f"https://{owner}.github.io/{repo}/"
    except Exception:
        return f"https://{owner}.github.io/{repo}/"

def main():
    if len(sys.argv) < 4:
        print("Usage: python deploy_github.py <GITHUB_TOKEN> <GITHUB_USERNAME> <REPO_NAME>")
        sys.exit(1)

    token = sys.argv[1]
    owner = sys.argv[2]
    repo = sys.argv[3]
    directory = os.path.dirname(os.path.abspath(__file__))

    files = [
        'index.html',
        'app.js',
        'styles.css',
        'vite.config.js',
        'package.json',
        '.gitignore',
        'README.md',
        '.github/workflows/deploy.yml'
    ]
    print(f"Deploying Happy Diwali Greeting Card to GitHub ({owner}/{repo})...")

    for f in files:
        p = os.path.join(directory, f)
        if os.path.exists(p):
            print(f"Uploading {f}...")
            upload_file_to_github(token, owner, repo, p, f)

    pages_url = enable_pages(token, owner, repo)
    print("\n🎉 Deployment completed!")
    print(f"👉 Live Website: {pages_url}")
    print(f"👉 Personalized Card Link: {pages_url}?view=card&from=Aarav&to=Priya%20%26%20Family")

if __name__ == "__main__":
    main()
