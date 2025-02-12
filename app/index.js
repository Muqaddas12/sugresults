import React, { useEffect, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, View, Modal, FlatList,Dimensions,StatusBar } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
//Homepage Helpers
import generateSessionOptions from '../src/Homepage/GenerateSessionOptions';
import CourseBySession from '../src/Homepage/CourseBySessions';
import GetResults from '../src/Homepage/GetResult';
import SemesterByCourse from '../src/Homepage/SemesterByCourse';
const {width,height}=Dimensions.get('window')
const Homepage = () => {
  const [course, setCourse] = useState('');
  const [session, setSession] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [semester, setSemester] = useState('');
  const [loading, setLoading] = useState(false);
  const [semestersItem, setSemestersItem] = useState([{ label: '-- Choose --', value: '' }]);
  const [courseItem, setCourseItem] = useState([{ label: '-- Choose --', value: '' }]);
  const [sessionLabel,setSessionLabel]=useState(null)
  const [courseLabel,setCourseLabel]=useState(null)
  const [semesterLabel,setSemesterLabel]=useState(null)
  const [isSessionSelected,setSessionSelected]=useState(false)
  const [isCourseSelected,setCourseSelected]=useState(false)
  const [isSemesterSelected,setSemesterSelected]=useState(false)

  const [isModalVisible, setModalVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState('');
  const [modalData, setModalData] = useState([]);

  //Generating session Items
  const sessionItems = generateSessionOptions();

  useEffect(() => {
    const result = CourseBySession(session);
    console.log(result);
    setCourseItem(result);
  }, [session]);

  //Generating semester item by using course selection
  useEffect(() => {
    if (session && course) {
      const result = SemesterByCourse(session, course);
      setSemestersItem(result);
    } else {
      console.log('nothing to show');
    }
  }, [course]);

  const handleViewResult = async () => {
setLoading(true)
    if (!course || !rollNumber || !semester || !session) {
      Alert.alert('Error', 'All fields are required');
      setLoading(false)
      return;
    }

    await GetResults(course, session, rollNumber, semester);
    setLoading(false)
  };


  const openModal = (pickerType) => {
    setCurrentPicker(pickerType);
    switch (pickerType) {
      case 'session':
        setModalData(sessionItems);
        setSessionSelected(true)

        break;
      case 'course':
        setModalData(courseItem);
        setCourseSelected(true)
        break;
      case 'semester':
        setModalData(semestersItem);
        setSemesterSelected(true)
        break;
      default:
        setModalData([]);
    }
    setModalVisible(true);
  };

  const selectItem = (item) => {
    switch (currentPicker) {
      case 'session':
        setSession(item.value);
        setSessionLabel(item.label)
        break;
      case 'course':
        setCourse(item.value);
        setCourseLabel(item.label)
        break;
      case 'semester':
        setSemester(item.value);
        setSemesterLabel(item.label)
        break;
      default:
        break;
    }
    setModalVisible(false);
  };
const handleCloseIcon=()=>{
  setModalVisible(!isModalVisible)
}
  return (
    <View style={styles.container}>
      <StatusBar
       barStyle={'transparent'}
       hidden={false}
       />
      <Image
        source={{
          uri: 'https://dli6r6oycdqaz.cloudfront.net/college-36/user-109260/30c39e6db4a149f89b6fd7f01e0cdde9_20210608_132206_36_109260_SUG_logo.png',
        }}
        style={styles.image}
      />
      <Text style={styles.header}>Shobhit University Gangoh</Text>
      <Text style={styles.subHeader}>Results</Text>
   

      <Text style={styles.label}>Select Session: </Text>
      <TouchableOpacity 
       activeOpacity={loading ? 1 : 0.7}
      onPress={() => !loading&&openModal('session')} 
      style={[styles.pickerContainer,loading&&styles.disabled]}>
        <Text style={styles.pickerText}>{sessionLabel || '-- Choose --'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Select Your Course: </Text>
      <TouchableOpacity
       activeOpacity={loading ? 1 : 0.7}
      disabled={isSessionSelected?false:true}
        onPress={() =>!loading&& openModal('course')} style={[styles.pickerContainer,loading&&styles.disabled]}>
        <Text style={styles.pickerText}>{courseLabel || '-- Choose --'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Select Semester: </Text>
      <TouchableOpacity
       activeOpacity={loading ? 1 : 0.7}
       disabled={isCourseSelected?false:true}
        onPress={() => !loading&&openModal('semester')} style={[styles.pickerContainer,loading&&styles.disabled]}>
        <Text style={styles.pickerText}>{semesterLabel || '-- Choose --'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Enter Your Roll Number:</Text>
      <TextInput
    editable={isSemesterSelected?true:false}
        style={[styles.input,loading&&styles.disabled]}
        placeholder="Enter Roll Number"
        keyboardType="numeric"
        value={rollNumber}
        onChangeText={setRollNumber}
      />

      <TouchableOpacity
       onPress={!loading&&handleViewResult}
       disabled={loading?true:false}
       activeOpacity={loading ? 1 : 0.7}
      accessibilityRole={loading?'none':'adjustable'}
        style={styles.button}>
        <Text style={styles.buttonText}>View Result</Text>
      </TouchableOpacity>


      {/* Modal Picker */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
        
          <View style={styles.modalContent}>
        <View   
          style={styles.closeIcon}> 
          <TouchableOpacity onPress={handleCloseIcon}>
          <Icon name='close' 
    style={{marginBottom:10}}
         size={25}/>
          </TouchableOpacity>
          </View>
         
            <FlatList
              data={modalData}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectItem(item)} style={styles.modalItem}>
                  <Text style={styles.modalText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      <View style={styles.loading}>    
          {loading && <ActivityIndicator style={styles.lodingIcon} animating={loading} size="large" color="#5e46b4" />}
      </View>
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
  pickerContainer: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderColor: '#AAAAAA',
    borderWidth: 1,
    backgroundColor: '#F8F8F8',
    marginBottom: 20,
  },
  pickerText: {
    fontSize: 16,
    color: '#333333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    maxHeight:height*.8
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalText: {
    fontSize: 18,
    color: '#333',
  },
  loading:{
    position:'absolute',
    alignItems:'center',
    justifyContent:'center',
    height:100,
    width:200,
    zIndex:1000,
    borderRadius:10,
    

  },
  disabled: {
    backgroundColor: '#e0e0e0', // Light gray when disabled
    borderColor: '#d3d3d3', // Lighter border when disabled
  },
  closeIcon:{
    justifyContent:'center',
    alignItems:'flex-end',
  borderBottomWidth:1,
  marginHorizontal:3
  }
});

export default Homepage;
