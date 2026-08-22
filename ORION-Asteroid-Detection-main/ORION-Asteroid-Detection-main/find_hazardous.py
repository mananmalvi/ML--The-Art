import pickle
import numpy as np

# Load model
with open("model.pkl", "rb") as file:
    model = pickle.load(file)

print("Model loaded successfully!")
print("Model:", model)

# Try different values
test_values = [
    [10, 1, 2, 25, 100000],
    [15, 1, 2, 30, 500000],
    [12, 2, 5, 40, 100000],
    [8, 5, 10, 50, 50000],
    [5, 10, 20, 60, 10000],
    [18, 0.5, 1, 20, 100000],
    [20, 0.1, 0.2, 15, 5000000],
]

for values in test_values:

    features = np.array([values])

    prediction = model.predict(features)[0]

    print(
        "Input:",
        values,
        "=> Prediction:",
        prediction
    )

    if prediction == 1:
        print(">>> HAZARDOUS FOUND!")