import { Alert } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';

const GetResults = async (course, session, rollNumber, semester) => {
  let url = null;

  if (session === '201819') {
    url = `https://103.57.178.67/${course}2019`;
  } else {
    url = `https://103.57.178.67/S${session}/${course}${session}/${semester}.php?Enroll=${rollNumber}`;
  }

  try {
    const response = await axios.get(`https://myexpressfunction-lb7pw6wsnq-uc.a.run.app?url=${url}`, {
      timeout: 20000,
    });

    const result = response.data.result;
    const rurl = response.data.url;

    if (url === rurl && result) {
      router.push({
        pathname: '/ResultView',
        params: {
          result: result,
          rollNumber: String(rollNumber),
        },
      });
      return true;
    } else {
      Alert.alert('Result Not Found', 'Invalid Course, Session, Semester, or Roll Number. Please verify your details.');
      return false;
    }
  } catch (_error) {
    Alert.alert('Network Error', 'Failed to fetch result. Please check your internet connection and try again.');
    return false;
  }
};

export default GetResults;
