import { NativeModules,Alert } from "react-native";
const { CustomModule } = NativeModules;
import { router } from "expo-router";
const GetResults =async (course,session,rollNumber,semester) => {

      let url = null;  // Initialize the URL for fetching the result
  
    // Construct the URL based on the session (checks if session is '201819')
    if (session === '201819') {
      url = `https://103.57.178.67/${course}2019`;  // URL format for 2018-2019 session
    } else {
      // For other sessions, the URL has a different structure
      url = `https://103.57.178.67/S${session}/${course}${session}/${semester}.php?Enroll=${rollNumber}`;
    }
 
  try {
    const result = await CustomModule.GET(url);
    const responseUrl=result.responseUrl
    console.log(url===responseUrl)
  // If the URL requested matches the response URL, navigate to the 'ResultView' screen
  if (url === responseUrl) {
        const data=result.responseBody
    router.replace({
      pathname: '/ResultView',
      params:{data},
    })  // Passing the fetched data to ResultView
  } else {
    // If URL doesn't match, display an error alert
 Alert.alert('Invalid Course/Session/Semester/RollNumber');
 return
  }
  } catch (error) {
     // Handle errors during the request (like network issues or server errors)
     console.error('Error fetching result:', error);
     Alert.alert('Failed to fetch result. Please try again later.');
     return
  }
};

export default GetResults;
