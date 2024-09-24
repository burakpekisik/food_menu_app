Projenizde Selenium ile yemek listesini çeken bir API olduğuna göre, README'yi güncelleyerek bu özelliği de dahil ediyorum:

---

# Food Menu App

The **Food Menu App** is a mobile application that displays a list of food items, with an integrated API that scrapes food data using **Selenium**. The app offers features like food search, filtering, and a responsive design. Built using **Flutter**, it works seamlessly on both iOS and Android devices.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [API](#api)
- [Usage](#usage)
- [License](#license)

## Features

- **Food Listing**: Displays a list of food items with names, descriptions, and images.
- **Search and Filter**: Users can search for specific dishes or filter based on categories.
- **Responsive Design**: Ensures an optimal experience across different devices.
- **Selenium-based Data Scraping API**: Retrieves the food menu dynamically using Selenium automation.
- **Offline Support**: Caches data locally for offline access.

## Technologies Used

- **Flutter**: Cross-platform framework used for developing the mobile app.
- **Dart**: Programming language used with Flutter.
- **Selenium**: Used to scrape the food data from a website.
- **Provider**: State management solution in Flutter.
- **MySQL (Optional)**: For local storage and offline capabilities.

## Installation

To run the Food Menu App locally:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/burakpekisik/food_menu_app.git
    ```

2. **Navigate to the project directory:**
    ```bash
    cd food_menu_app
    ```

3. **Install Flutter dependencies:**
    ```bash
    flutter pub get
    ```

4. **Run the app:**
    Use the following command to run the app on an Android/iOS simulator or device:
    ```bash
    flutter run
    ```

5. **Set up Selenium (Optional):**
    - Ensure you have a working **Selenium** environment.
    - Install the required browser drivers (e.g., **ChromeDriver**).
    - Modify the API settings to fit your Selenium setup.

## API

The project includes a backend API that uses Selenium to scrape a food menu from a specific website.

### API Overview:

- **Technology**: Python, Selenium
- **Purpose**: Scrapes and returns the food menu in a structured format (JSON)
  
### Setting Up Selenium:

1. Install the required Python libraries:
    ```bash
    pip install selenium
    ```

2. Set up the required web driver (e.g., ChromeDriver):
    - Download and install the appropriate version of **ChromeDriver**.
    - Add the driver to your system PATH.

3. Run the API:
    ```bash
    python api.py
    ```
## Usage

Once installed, the app will allow users to browse through available food options. The app pulls the food list from the backend API using Selenium, and users can interact with this data through the mobile interface.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
