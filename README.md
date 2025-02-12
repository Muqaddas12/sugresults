![App Screenshot](./assets/logo.png)

# SugResults - Shobhit University Results Viewer

This React Native application allows users to view exam results at Shobhit University Gangoh. It takes  sessions, courses, semesters, and entering roll numbers to fetch results

## Components

### Homepage
The main screen where users can select their session, course, semester, and enter roll number to view results.

### ResultView
A component to display results in a WebView. It receives the data passed via query parameters and displays the formatted results. If the result data includes links or images, they are appropriately handled to ensure a smooth user experience. A "Search Another Number" button is available to allow users to go back and search another roll number.

### Helper Functions
- **GenerateSessionOptions**: Generates the session options for the user to choose from.
- **CourseBySession**: Fetches available courses for the selected session.
- **SemesterByCourse**: Fetches the available semesters for the selected course.
- **GetResults**: Fetches results based on the selected session, course, semester, and roll number.

## Technologies Used

- **React Native**: To build the mobile app.
- **Expo Router**: For routing and navigation in the app.
- **WebView**: To display HTML content for the results.
- **Native Module**: For making API calls or fetching data.
- **React Navigation**: For handling navigation and routing in the app.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Muqaddas12/sugresults.git
```
### 2.Navigate to the project directory
```` bash
cd sugresults
````
3. Install dependencies
Install the required dependencies using npm or yarn:
```` bash
npm install
````
Or with yarn:
````bash
yarn install
````
4. Run the app
To run the app on an Android emulator or a physical device, use the following:
```` bash
npx react-native run-android
````
Or if you're using Expo:
```` bash
expo start --dev-client
````
OR
```` bash
npm start
````

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

If you would like to contribute to the project:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Push the branch and create a pull request.


