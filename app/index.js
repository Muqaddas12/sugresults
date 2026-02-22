import React, { useEffect, useState ,useRef} from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
  StatusBar,
  ToastAndroid,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import logo from '../src/images/logo';
import SessionSelectModal from '../src/components/SessionSelectModal';
// Helpers & Config
import generateSessionOptions from '../src/helper/getSessionDropdownOptions';
import GetResults from '../src/helper/GetResult';
import coursesConfig from '../src/config/courseConfig.json';
import semesterconfig from '../src/config/semesterConfig.json';
import { saveSelectedData,getSelectedData } from '../src/helper/storage';
import BottomBar from '../src/components/BottomBar';
import LoadingIndicator from '../src/components/ActivityIndicator';
const Homepage = () => {
  const [course, setCourse] = useState('');
  const [session, setSession] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [semester, setSemester] = useState('');
  const [loading, setLoading] = useState(false);
const [initialLoading, setInitialLoading] = useState(true);
  const [semestersItem, setSemestersItem] = useState([]);
  const [courseItem, setCourseItem] = useState([]);

  const [isSessionSelected, setSessionSelected] = useState(false);
  const [isCourseSelected, setCourseSelected] = useState(false);
  const [isSemesterSelected, setSemesterSelected] = useState(false);
const [sessionModalVisible, setSessionModalVisible] = useState(false);
const [courseModalVisible, setCourseModalVisible] = useState(false);
const [semesterModalVisible, setSemesterModalVisible] = useState(false);
  // Generate session dropdown options
  const sessionItems = generateSessionOptions();
// Load saved selection when app starts
useEffect(() => {
  const fetchSavedSelection = async () => {
    try {
      setInitialLoading(true);

      const savedData = await getSelectedData();

      if (savedData) {
        setSession(savedData.session);
        setCourse(savedData.course);
        setSemester(savedData.semester);
        setRollNumber(savedData.rollNumber);

        if (savedData.session) setSessionSelected(true);
        if (savedData.course) setCourseSelected(true);
        if (savedData.semester) setSemesterSelected(true);
      }
    } catch (error) {
      console.log('Error loading saved selection:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  fetchSavedSelection();
}, []);
  // Update course menu when session changes
  useEffect(() => {
    setCourseItem(
      coursesConfig[session]?.courses || coursesConfig.default.courses
    );
  }, [session]);

  // Update semester menu when course changes
  useEffect(() => {
    setSemestersItem(
      session && course
        ? semesterconfig[session]?.[course] ||
            semesterconfig.default?.[course] ||
            []
        : []
    );
  }, [session, course]);

  // Handle "View Result" action
  const handleViewResult = async () => {
    if (!course || !rollNumber || !semester || !session) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    
  await saveSelectedData(session, course, semester, rollNumber);
    setLoading(true);
    await GetResults(course, session, rollNumber, semester);
    setLoading(false);
  };

  // Dropdown state management
  const dropDownMenuHandler = (value, type) => {
  if (type === 'session') {
    setSession(value);
    setSessionSelected(!!value);
  }

  if (type === 'course') {
    setCourse(value);
    setCourseSelected(!!value);
  }

  if (type === 'semester') {
    setSemester(value);
    setSemesterSelected(!!value);
  }
};

 return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <StatusBar barStyle={'dark-content'} />

          <Image
            source={{
              uri: logo,
            }}
            style={styles.image}
          />

          <Text style={styles.header}>Shobhit University Gangoh</Text>
          <Text style={styles.subHeader}>GRADE SHEET (PROVISIONAL)</Text>

          {/* Session Dropdown */}
          <Text style={styles.label}>Select Session:</Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => setSessionModalVisible(true)}
          >
            <Text
              style={
                session ? styles.pickerText : styles.placeholderText
              }
            >
              {sessionItems.find(
                item => item.value === session
              )?.label || '-- Choose --'}
            </Text>
            <Text style={styles.arrow}>▼</Text>
          </TouchableOpacity>

          <SessionSelectModal
            visible={sessionModalVisible}
            onClose={() => setSessionModalVisible(false)}
            items={sessionItems}
            selectedValue={session}
            onSelect={(value) =>
              dropDownMenuHandler(value, 'session')
            }
          />

          {/* Course Dropdown */}
          <Text style={styles.label}>Select Your Course:</Text>
          <TouchableOpacity
            style={[
              styles.picker,
              !isSessionSelected && styles.disabled,
            ]}
            onPress={() =>
              isSessionSelected &&
              setCourseModalVisible(true)
            }
            disabled={!isSessionSelected}
          >
            <Text
              style={
                course ? styles.pickerText : styles.placeholderText
              }
            >
              {courseItem.find(
                item => item.value === course
              )?.label || '-- Choose --'}
            </Text>
            <Text style={styles.arrow}>▼</Text>
          </TouchableOpacity>

          <SessionSelectModal
            visible={courseModalVisible}
            onClose={() => setCourseModalVisible(false)}
            items={courseItem}
            selectedValue={course}
            onSelect={(value) =>
              dropDownMenuHandler(value, 'course')
            }
          />

          {/* Semester Dropdown */}
          <Text style={styles.label}>Select Semester:</Text>
          <TouchableOpacity
            style={[
              styles.picker,
              !isCourseSelected && styles.disabled,
            ]}
            onPress={() =>
              isCourseSelected &&
              setSemesterModalVisible(true)
            }
            disabled={!isCourseSelected}
          >
            <Text
              style={
                semester
                  ? styles.pickerText
                  : styles.placeholderText
              }
            >
              {semestersItem.find(
                item => item.value === semester
              )?.label || '-- Choose --'}
            </Text>
            <Text style={styles.arrow}>▼</Text>
          </TouchableOpacity>

          <SessionSelectModal
            visible={semesterModalVisible}
            onClose={() => setSemesterModalVisible(false)}
            items={semestersItem}
            selectedValue={semester}
            onSelect={(value) =>
              dropDownMenuHandler(value, 'semester')
            }
          />

          {/* Roll Number Input */}
          <Text style={styles.label}>
            Enter Your Roll Number:
          </Text>
          <TextInput
            editable={isSemesterSelected}
            style={[styles.input, loading && styles.disabled]}
            placeholder="Enter Roll Number"
            keyboardType="numeric"
            value={rollNumber}
            onChangeText={(text) => {
              const filtered = text
                .replace(/[^0-9]/g, '')
                .slice(0, 15);
              setRollNumber(filtered);
              if (text.length >= 15) {
                ToastAndroid.show(
                  'Maximum 15 digits allowed',
                  ToastAndroid.SHORT
                );
              }
            }}
          />

          {/* View Result Button */}
          <TouchableOpacity
            onPress={() =>
              rollNumber.length > 5
                ? handleViewResult()
                : ToastAndroid.show(
                    'Roll number must be at least 6 digits',
                    ToastAndroid.SHORT
                  )
            }
            disabled={
              loading || rollNumber.length < 6
            }
            style={
              loading || rollNumber.length < 6
                ? styles.buttonDisabled
                : styles.button
            }
          >
            <Text style={styles.buttonText}>
              View Result
            </Text>
          </TouchableOpacity>

         

          <BottomBar currentPage={'Home'} />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>

{loading && (
  <LoadingIndicator message="Please wait while we are loading your result..." />
)}
  </KeyboardAvoidingView>
);
};

const styles = StyleSheet.create({
 container: {
  flex:1,
  paddingHorizontal: 20,
  paddingTop: 30,
 
  backgroundColor: '#FFFFFF',
  alignItems: 'center',
},

  image: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginBottom: 15,
  },

  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E2E2E',
    textAlign: 'center',
    marginBottom: 6,
  },

  subHeader: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B6B6B',
    textAlign: 'center',
    marginBottom: 25,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
    marginTop: 10,
    alignSelf: 'flex-start',
  },

  picker: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    backgroundColor: '#F9FAFB',
    marginBottom: 15,
  },

  pickerText: {
    fontSize: 15,
    color: '#333',
  },

  placeholderText: {
    fontSize: 15,
    color: '#9E9E9E',
  },

  arrow: {
    fontSize: 16,
    color: '#666',
  },

  input: {
    width: '100%',
    height: 48,
    borderColor: '#D0D5DD',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    color: '#333',
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#5e46b4',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  buttonDisabled: {
    backgroundColor: '#B0B0B0',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  disabled: {
    backgroundColor: '#F2F2F2',
    borderColor: '#E0E0E0',
    opacity: 0.7,
  },

  loading: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    width: 220,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    elevation: 5,
  },
});
export default Homepage;
