import requests

data = {
    "magnitude": 20.0,
    "min_diameter": 0.1,
    "max_diameter": 0.2,
    "velocity": 15.0,
    "miss_distance": 5000000
}

response = requests.post(
    "http://127.0.0.1:5000/predict",
    json=data
)

print(response.json())