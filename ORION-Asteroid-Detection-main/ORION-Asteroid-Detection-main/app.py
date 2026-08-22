from flask import Flask, request, jsonify, render_template
import pickle
import numpy as np

app = Flask(__name__)


# =========================================================
# LOAD ORION MODEL
# =========================================================

with open("model.pkl", "rb") as file:
    model = pickle.load(file)


# =========================================================
# HOME
# =========================================================

@app.route("/")
def home():
    return render_template("index.html")


# =========================================================
# PREDICTION
# =========================================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        magnitude = float(data["magnitude"])
        min_diameter = float(data["min_diameter"])
        max_diameter = float(data["max_diameter"])
        velocity = float(data["velocity"])
        miss_distance = float(data["miss_distance"])


        # -------------------------------------------------
        # FEATURES
        # -------------------------------------------------

        features = np.array([[
            magnitude,
            min_diameter,
            max_diameter,
            velocity,
            miss_distance
        ]])


        # -------------------------------------------------
        # MODEL PREDICTION
        # -------------------------------------------------

        prediction = int(model.predict(features)[0])


        # -------------------------------------------------
        # RESULT
        # -------------------------------------------------

        if prediction == 1:
            result = "HAZARDOUS"
        else:
            result = "SAFE"


        # -------------------------------------------------
        # CONFIDENCE
        # -------------------------------------------------

        confidence = None

        if hasattr(model, "predict_proba"):

            probabilities = model.predict_proba(features)[0]

            confidence = float(
                max(probabilities) * 100
            )


        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        return jsonify({

            "success": True,

            "prediction": prediction,

            "result": result,

            "confidence": confidence,

            "parameters": {

                "magnitude": magnitude,

                "min_diameter": min_diameter,

                "max_diameter": max_diameter,

                "velocity": velocity,

                "miss_distance": miss_distance

            }

        })


    except Exception as e:

        print("Prediction error:", e)

        return jsonify({

            "success": False,

            "error": str(e)

        }), 400


# =========================================================
# RUN SERVER
# =========================================================

if __name__ == "__main__":

    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )