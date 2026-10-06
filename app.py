
import requests
from flask import Flask, render_template, request
import os

app = Flask(__name__)


# Open the home page
@app.route("/")
def home():
    return render_template("index.html")


# Search for a food
@app.route("/search")
def search():

    # Get the food name entered by the user
    food = request.args.get("food")

   

    # USDA API URL
    url = "https://api.nal.usda.gov/fdc/v1/foods/search"

    # Send a request to the USDA database
    response = requests.get(url, params={
        "api_key": os.environ.get("mC3mgibzubLSlqou52hdYo4j9gdUIKq1gvnnWnXk"),
git add .        "query": food,
        "pageSize": 1
    })

   
    # Convert the response into Python data
    data = response.json()

  

    # Get the first food from the results
    item = data["foods"][0]

    # Store the nutrition information
    calories = 0
    protein = 0
    fiber = 0
    carbs = 0
    fat = 0
    sugar = 0

    # Check every nutrient in the food
    for nutrient in item["foodNutrients"]:

        name = nutrient["nutrientName"]
        value = nutrient["value"]

        if name == "Energy":
            calories = value

        elif name == "Protein":
            protein = value

        elif name == "Fiber, total dietary":
            fiber = value

        elif name == "Carbohydrate, by difference":
            carbs = value

        elif name == "Total lipid (fat)":
            fat = value

        elif name == "Sugars, total including NLEA":
            sugar = value

    # Send the results to the food page
    return render_template(
        "foods.html",
        food=item["description"],
        calories=calories,
        protein=protein,
        fiber=fiber,
        carbs=carbs,
        fat=fat,
        sugar=sugar
    )


# Run the website
if __name__ == "__main__":
    app.run(debug=True)
