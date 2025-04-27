import React, { useEffect, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, View, StatusBar,Dimensions } from 'react-native';
import RNPickerSelect from 'react-native-picker-select'; 
import Icon from 'react-native-vector-icons/FontAwesome';

// Homepage Helpers
import generateSessionOptions from '../src/Homepage/GenerateSessionOptions';
import CourseBySession from '../src/Homepage/CourseBySessions';
import GetResults from '../src/Homepage/GetResult';
import SemesterByCourse from '../src/Homepage/SemesterByCourse';

const { width, height } = Dimensions.get('window');

const Homepage = () => {
  const [course, setCourse] = useState('');
  const [session, setSession] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [semester, setSemester] = useState('');
  const [loading, setLoading] = useState(false);
  const [semestersItem, setSemestersItem] = useState([]);
  const [courseItem, setCourseItem] = useState([]);
  const [sessionLabel, setSessionLabel] = useState(null);
  const [courseLabel, setCourseLabel] = useState(null);
  const [semesterLabel, setSemesterLabel] = useState(null);
  const [isSessionSelected, setSessionSelected] = useState(false);
  const [isCourseSelected, setCourseSelected] = useState(false);
  const [isSemesterSelected, setSemesterSelected] = useState(false);

  // Generating session Items
  const sessionItems = generateSessionOptions();

  useEffect(() => {
    const result = CourseBySession(session);
 
    setCourseItem(result);
  }, [session]);

  // Generating semester item by using course selection
  useEffect(() => {
    if (session && course) {

      const result = SemesterByCourse(session, course);

      setSemestersItem(result);
    }
  }, [course]);

  const handleViewResult = async () => {
    setLoading(true);
    if (!course || !rollNumber || !semester || !session) {
      Alert.alert('Error', 'All fields are required');
      setLoading(false);
      return;
    }

    await GetResults(course, session, rollNumber, semester);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'transparent'} hidden={false} />
      <Image
        source={{
          uri: 'https://dli6r6oycdqaz.cloudfront.net/college-36/user-109260/30c39e6db4a149f89b6fd7f01e0cdde9_20210608_132206_36_109260_SUG_logo.png',
        }}
        style={styles.image}
      />
      <Text style={styles.header}>Shobhit University Gangoh</Text>
      <Text style={styles.subHeader}>GRADE SHEET(PROVISIONAL)</Text>

      <Text style={styles.label}>Select Session: </Text>
      <RNPickerSelect
        onValueChange={(value) => {
          setSession(value);
          setSessionLabel(value);
          setSessionSelected(true);
        }}
        items={sessionItems}
        placeholder={{
          label: '-- Choose --',
          value: '',
        }}
        style={styles.picker}
        value={session}
      />

      <Text style={styles.label}>Select Your Course: </Text>
      <RNPickerSelect
        onValueChange={(value) => {
          setCourse(value);
          setCourseLabel(value);
          setCourseSelected(true);
        }}
        items={courseItem}
        placeholder={{
          label: '-- Choose --',
          value: '',
        }}
        style={styles.picker}
        value={course}
        disabled={!isSessionSelected}
      />

      <Text style={styles.label}>Select Semester: </Text>
      <RNPickerSelect
        onValueChange={(value) => {
          setSemester(value);
          setSemesterLabel(value);
          setSemesterSelected(true);
        }}
        items={semestersItem}
        placeholder={{
          label: '-- Choose --',
          value: '',
        }}
        style={styles.picker}
        value={semester}
        disabled={!isCourseSelected}
      />

      <Text style={styles.label}>Enter Your Roll Number:</Text>
      <TextInput
        editable={isSemesterSelected}
        style={[styles.input, loading && styles.disabled]}
        placeholder="Enter Roll Number"
        keyboardType="numeric"
        value={rollNumber}
        onChangeText={setRollNumber}
      />

      <TouchableOpacity
        onPress={!loading && handleViewResult}
        disabled={loading}
        activeOpacity={loading ? 1 : 0.7}
        accessibilityRole={loading ? 'none' : 'adjustable'}
        style={styles.button}
      >
        <Text style={styles.buttonText}>View Result</Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator style={styles.lodingIcon} animating={loading} size="large" color="#5e46b4" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#AAAAAA',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#F8F8F8',
    color: '#333333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#5e46b4',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  picker: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderColor: '#AAAAAA',
    borderWidth: 1,
    backgroundColor: '#F8F8F8',
    marginBottom: 20,
  },
  loading: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: 200,
    zIndex: 1000,
    borderRadius: 10,
  },
  disabled: {
    backgroundColor: '#e0e0e0', // Light gray when disabled
    borderColor: '#d3d3d3', // Lighter border when disabled
  },
});

export default Homepage;
