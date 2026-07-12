# [Project Title: e.g., Ensemble Learning: Voting Classifiers & Regressors]

## 📌 Overview
This repository contains a hands-on exploration of **Ensemble Learning**, specifically focusing on **Voting Classifiers** and **Voting Regressors** using `scikit-learn`. 

I built this project to understand how combining multiple machine learning models (like Logistic Regression, KNN, and Random Forest) can improve overall predictive accuracy compared to relying on a single model.

## 🧠 What I Learned
* **Soft vs. Hard Voting:** How averaging probabilities (soft) often yields different results than majority rules (hard).
* **Weight Tuning:** Built a nested loop to test custom weight distributions across models to find the highest accuracy/R² score.
* **Homogeneous Ensembles:** Evaluated how combining multiple variations of the same model (like SVCs with different polynomial degrees) impacts performance.

## 🧰 Tech Stack
* **Python**
* **scikit-learn** (Machine Learning algorithms & ensemble methods)
* **pandas & numpy** (Data manipulation)
* **seaborn** (Data visualization) 

## Flow Chart
graph TD
    A[Input Data] --> B(Logistic Regression)
    A --> C(K-Nearest Neighbors)
    A --> D(Random Forest)
    
    B -->|Weight 1| E{Soft Voting Aggregator}
    C -->|Weight 2| E
    D -->|Weight 3| E
    
    E --> F[Final Class Prediction]

## 📊 Datasets Used
* Iris Dataset 
* California Housing Dataset 
* Synthetic generated data

## 🚀 How to Run
1. Clone this repository: `git clone [Your Repository URL]`
2. Install dependencies: `pip install numpy pandas scikit-learn seaborn`
3. Open `[Your_Notebook_Name].ipynb` in Jupyter or Google Colab.
4. Run the cells to view the cross-validation scores.

---
## 📬 Let's Connect!
I am currently studying machine learning and building projects in public. 

* **LinkedIn:** [https://github.com/]
* **GitHub:** [https://www.linkedin.com/in/manan-malvi-7849b5382/]
