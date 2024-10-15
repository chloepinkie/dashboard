import sys
import requests
import jwt
import time
import json

def get_shopmy_token(user_id, password):
    auth_url = 'https://api.shopmy.us/api/auth/login'
    response = requests.post(auth_url, json={'userId': user_id, 'password': password})
    if response.status_code == 200:
        return response.json()['token']
    else:
        print(f"Auth failed: {response.status_code}")
        return None

def fetch_shopmy_data(token):
    today = time.strftime("%Y-%m-%d")
    url = f"https://api.shopmy.us/api/Pins?downloadAllToCsv=1&User_id=48231&sortDirection=desc&sortOrder=orderVolumeTotal&startDate={today}&endDate={today}&timezoneOffset=420&groupByMode=users&hideOtherRetailers=1"
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://shopmy.us',
        'Referer': 'https://shopmy.us/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Data fetch failed: {response.status_code}")
        return None

if __name__ == "__main__":
    user_id = sys.argv[1]
    password = sys.argv[2]

    token = get_shopmy_token(user_id, password)
    if token:
        data = fetch_shopmy_data(token)
        if data:
            print(json.dumps(data))
        else:
            print(json.dumps({"error": "Failed to fetch data"}))
    else:
        print(json.dumps({"error": "Failed to get token"}))
