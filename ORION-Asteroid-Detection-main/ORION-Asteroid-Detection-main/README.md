# 🌌 O.R.I.O.N.
## Orbital Reconnaissance & Impact Observation Network

> **AI-Powered Asteroid Hazard Classification System**

O.R.I.O.N. is an AI-powered asteroid threat analysis system designed to classify asteroids as **SAFE** or **HAZARDOUS** based on orbital and physical parameters.

The system provides a futuristic mission-control interface where users can enter asteroid data and receive an AI-based hazard prediction in real time.

---

## 🚀 Features

- 🤖 **AI-Based Asteroid Classification**
- 🟢 **SAFE / 🔴 HAZARDOUS Detection**
- 📊 Orbital parameter analysis
- 🌌 Real-time asteroid background visualization
- 🪟 Advanced glassmorphism UI
- 🎯 Mission-control inspired interface
- ⚡ Flask-powered prediction API
- 📡 Orbital tracking visualization
- 📈 Threat assessment panel
- 💡 Dynamic green/red threat indicators
- 🔄 New analysis without refreshing the page
- 👥 GitHub collaboration support

---

## 🧠 How It Works

O.R.I.O.N. analyzes five asteroid parameters:

| Parameter | Description | Unit |
|---|---|---|
| Absolute Magnitude | Brightness-related asteroid parameter | H |
| Minimum Diameter | Estimated minimum asteroid diameter | KM |
| Maximum Diameter | Estimated maximum asteroid diameter | KM |
| Relative Velocity | Asteroid velocity relative to Earth | KM/S |
| Miss Distance | Closest estimated distance from Earth | KM |

These parameters are passed to the trained machine-learning model.

The model returns:

```text
0 → SAFE
1 → HAZARDOUS
