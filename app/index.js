import React, {useEffect, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert,StyleSheet} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context';


const Picker = ({ label, items, onValueChange, value }) => (
  <>
    {/* Display the label for the dropdown */}
    <Text style={styles.label}>{label}</Text>

    {/* RNPickerSelect dropdown picker */}
    <RNPickerSelect
      onValueChange={onValueChange} // Function called when a value is selected
      value={value} // Current value selected in the dropdown
      items={items} // Dropdown options (label-value pairs)
      placeholder={{ label: '-- Choose --', value: null }} // Default placeholder when no value is selected
      style={pickerStyles} // Custom styles for the picker
    />
  </>
);


const Homepage = () => {
  
  const router = useRouter();

  const [course, setCourse] = useState('');
  const [session, setSession] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [semester, setSemester] = useState('');
  const [loading, setLoading] = useState(false);
  const [semestersitem,setSemestersItem]=useState([])
  const [courseItem,setCourseItem]=useState([])
  /* This handle press function is used to check 
  to fetch data from the server and navigate through
  ViewResult helper imported from scr/helper/homepage */
  const viewResult = async () => {

    // Check if all fields are filled, if any field is missing, show an alert
    if (!course || !session || !rollNumber || !semester) {
      Alert.alert('Input Validation', 'Please fill all fields!');
      return;
    }
  
    let url = null;  // Initialize the URL for fetching the result
  
    // Construct the URL based on the session (checks if session is '201819')
    if (session === '201819') {
      url = `http://103.57.178.67/${course}2019`;  // URL format for 2018-2019 session
    } else {
      // For other sessions, the URL has a different structure
      url = `http://103.57.178.67/S${session}/${course}${session}/${semester}.php?Enroll=${rollNumber}`;
    }
  
    try {
      setLoading(true)
      // Fetch data from the generated URL using axios
      const response = await axios.get(url);
      const data = response.data;  // Extracting the response data
      const rurl = response.request.responseURL;  // Getting the actual URL from the response
  
      // If the URL requested matches the response URL, navigate to the 'ResultView' screen
      if (url === rurl) {
        
        router.push({
          pathname: '/ResultView',
          params:{data},
        })  // Passing the fetched data to ResultView
      } else {
        // If URL doesn't match, display an error alert
        return alert('Invalid Course/Session/Semester/RollNumber');
      }
    } catch (error) {
      // Handle errors during the request (like network issues or server errors)
      console.error('Error fetching result:', error);
      Alert.alert('Failed to fetch result. Please try again later.');
    } finally {
      setLoading(false)// Optionally handle cleanup tasks, if needed (currently empty)
    }
  };
  // Function to dynamically generate session labels
  const generateSessionOptions = () => {
    const startYear = 2018;  // The starting academic year (used as base for session)
    const currentYear = new Date().getFullYear();  // The current year to generate up to
  
    const sessionOptions = [];  // Empty array to store the session options
  
    // Loop over each year from the start year to the current year, generating session options
    for (let year = startYear; year < currentYear; year++) {
      sessionOptions.push({
        label: `${year}-${year + 1}`,  // Label (e.g., '2018-2019')
        value: `${year}${(year + 1).toString().slice(-2)}`,  // Value (e.g., '1819')
      });
    }
  
    return sessionOptions;  // Return the list of session options
  };
  const sessionItems = generateSessionOptions();
//Show Course According to Session
     useEffect(()=>{

      if(session==='201819'||session==='201920'|| session==='202021'){
        setCourseItem([
          { label: 'UG & PG RESULTS', value: 'other' },
          { label: 'UG & PG CARRY RESULTS', value: 'otherc' },
          { label: 'DIPLOMA COURSES RESULTS', value: 'diploma' },
          { label: 'DIPLOMA COURSES CARRY RESULTS', value: 'diplomac' },
   
        ])
        return
      }else if(session==='202122'||session==='202223'){
        
        setCourseItem([
          { label: 'UG & PG RESULTS', value: 'other' },
          { label: 'UG & PG CARRY RESULTS', value: 'otherc' },
          { label: 'B.PHARMA CARRY RESULTS(ODD)', value: 'bpodd' },
          { label: 'B.PHARMA CARRY RESULTS(EVEN))', value: 'bpeven' },
          { label: 'B.PHARMA SPECIAL CARRY OVER RESULTS', value: 'bpspc' },
          { label: 'DIPLOMA COURSES RESULTS', value: 'diploma' },
          { label: 'DIPLOMA COURSES CARRY RESULTS', value: 'diplomac' },
   
        ])
        return
      }else if(session==='202324'){
        
        setCourseItem([
          { label: 'UG & PG RESULTS', value: 'other' },
          { label: 'UG & PG CARRY RESULTS(ODD)', value: 'otheroddc' },
          { label: 'UG & PG CARRY RESULTS(EVEN))', value: 'otherevenc' },
          { label: 'UG & PG CARRY RESULTS SPECIAL CARRY OVER RESULTS', value: 'otherspc' },
          { label: 'DIPLOMA COURSES RESULTS', value: 'diploma' },
          { label: 'DIPLOMA COURSES CARRY RESULTS(ODD)', value: 'diplomaoddc' },
          { label: 'DIPLOMA COURSES CARRY RESULTS(EVEN)', value: 'diplomaevenc' },
          { label: 'DIPLOMA COURSES SPECIAL CARRY OVER RESULTS', value: 'diplomaspc' },
   
        ])
        return
      }
      else {
        setCourseItem([])
      }
     },[session])

// Show Semester According To Course
  useEffect(()=>{
   
if(session==='201819'){
  //****************************2018-2019****************************
  if(course==='other'){
    setSemestersItem([  
      { label: 'UG & PG Semester1', value: '1' },
      { label: 'UG & PG Semester 2', value: '2' },
      { label: 'UG & PG Semester 3', value: '3' },
      { label: 'UG & PG Semester 4', value: '4' },
      { label: 'UG & PG Semester 5', value: '5' },
      { label: 'UG & PG Semester 6', value: '6' },
      { label: 'UG & PG Semester 7', value: '7' },
      { label: 'UG & PG Semester 8', value: '8' },
      { label: 'B.A.M.S Semester 1', value: 'BAMS%20I' },
      { label: 'B.A.M.S Semester 2', value: 'BAMS%20II' },
      { label: 'B.A.M.S Semester 3', value: 'BAMS%20III' },
      { label: 'B.A.M.S Semester 4', value: 'BAMS%20IV' },
    {label:'B.N.Y.S Semester 1' , value:'BNYS-I'},
    {label:'B.N.Y.S Semester 2' , value:'BNYS-II'},
    {label:'P.G.D-YOGA' , value:'PGD-YOGA%20I'},
    {label:'B.E.D Semester 1' , value:'BED%20I'},
    {label:'B.E.D Semester 2' , value:'BED%20II'},
    {label:'B.S.C-Agriculture Semester 1',value:'BSC-AG%20I'},
    {label:'B.S.C-Agriculture Semester 2',value:'BSC-AG%20II'},
    ])
    return
  }else if(course==='otherc'){
    setSemestersItem([  
      { label: 'UG & PG Semester1', value: '1' },
      { label: 'UG & PG Semester 2', value: '2' },
      { label: 'UG & PG Semester 3', value: '3' },
      { label: 'UG & PG Semester 4', value: '4' },
      { label: 'UG & PG Semester 5', value: '5' },
      { label: 'UG & PG Semester 6', value: '6' },
      { label: 'UG & PG Semester 7', value: '7' },
      { label: 'UG & PG Semester 8', value: '8' },
      { label: 'B.A.M.S Semester 1', value: 'BAMS%20I' },
      { label: 'B.A.M.S Semester 2', value: 'BAMS%20II' },
      { label: 'B.A.M.S Semester 3', value: 'BAMS%20III' },
      { label: 'B.A.M.S Semester 4', value: 'BAMS%20IV' },
      { label: 'B.A.M.S Semester 1 OCT-19', value: 'BAMS%20I-OCT19' },
      { label: 'B.A.M.S Semester 2 OCT-19', value: 'BAMS%20II-OCT19' },
      { label: 'B.A.M.S Semester 3 OCT-19', value: 'BAMS%20III-OCT19' },
      { label: 'B.A.M.S Semester 4 OCT-19', value: 'BAMS%20IV-OCT19' },
    {label:'B.N.Y.S Semester 1' , value:'BNYS-I'},
    {label:'B.N.Y.S Semester 2' , value:'BNYS-II'},
    {label:'P.G.D-YOGA' , value:'PGD-YOGA%20I'},
    {label:'B.E.D Semester 1' , value:'BED%20I'},
    {label:'B.E.D Semester 2' , value:'BED%20II'},
    {label:'B.S.C-Agriculture Semester 1',value:'BSC-AG%20I'},
    {label:'B.S.C-Agriculture Semester 2',value:'BSC-AG%20II'},
    ])
    return
  }else if(course==='diploma'|| course==='diplomac'){
    setSemestersItem([
      { label: 'Diploma Semester1', value: '1' },
      { label: 'Diploma Semester 2', value: '2' },
      { label: 'Diploma Semester 3', value: '3' },
      { label: 'Diploma Semester 4', value: '4' },
      { label: 'Diploma Semester 5', value: '5' },
      { label: 'Diploma Semester 6', value: '6' },
      { label: 'DPHARMA Semester 1', value: 'DPHARM%20I' },
      { label: 'DPHARMA Semester 2', value: 'DPHARM%20II' },
    ])
  }
  }else if(session==='201920'){
    if(course==='other'){
      setSemestersItem([  
        { label: 'UG & PG Semester1', value: '1' },
        { label: 'UG & PG Semester 2', value: '2' },
        { label: 'UG & PG Semester 3', value: '3' },
        { label: 'UG & PG Semester 4', value: '4' },
        { label: 'UG & PG Semester 5', value: '5' },
        { label: 'UG & PG Semester 6', value: '6' },
        { label: 'UG & PG Semester 7', value: '7' },
        { label: 'UG & PG Semester 8', value: '8' },
        { label: 'B.A.M.S Semester 1', value: 'BAMS%20I' },
        { label: 'B.A.M.S Semester 2', value: 'BAMS%20II' },
        { label: 'B.A.M.S Semester 3', value: 'BAMS%20III' },
        { label: 'B.A.M.S Semester 4', value: 'BAMS%20IV' },
        { label: 'B.A.M.S Semester 4-OCT20', value: 'BAMS%20IV-OCT20' },
      {label:'B.N.Y.S Semester 1' , value:'BNYS-I'},
      {label:'B.N.Y.S Semester 2' , value:'BNYS-II'},
      {label:'P.G.D-YOGA' , value:'PGD-YOGA%20I'},
      {label:'B.E.D Semester 1' , value:'BED%20I'},
      {label:'B.E.D Semester 2' , value:'BED%20II'},
      {label:'B.A YOGA',value:'BA%20YOGA'},
      ])
      return
    }else if(course==='otherc'){
      setSemestersItem([  
        { label: 'UG & PG Semester1', value: '1' },
        { label: 'UG & PG Semester 2', value: '2' },
        { label: 'UG & PG Semester 3', value: '3' },
        { label: 'UG & PG Semester 4', value: '4' },
        { label: 'UG & PG Semester 5', value: '5' },
        { label: 'UG & PG Semester 6', value: '6' },
        { label: 'UG & PG Semester 7', value: '7' },
        { label: 'UG & PG Semester 8', value: '8' },
        { label: 'B.A.M.S Semester 1', value: 'BAMS%20I' },
        { label: 'B.A.M.S Semester 2', value: 'BAMS%20II' },
        { label: 'B.A.M.S Semester 3', value: 'BAMS%20III' },
        { label: 'B.A.M.S Semester 4', value: 'BAMS%20IV' },
        { label: 'B.A.M.S Semester 1-OCT19', value: 'BAMS%20I-OCT19' },
        { label: 'B.A.M.S Semester 2-OCT19', value: 'BAMS%20II-OCT19' },
        { label: 'B.A.M.S Semester 3-OCT19', value: 'BAMS%20III-OCT19' },
        { label: 'B.A.M.S Semester 4-OCT19', value: 'BAMS%20IV-OCT19' },
      {label:'B.N.Y.S Semester 1' , value:'BNYS-I'},
      {label:'B.N.Y.S Semester 2' , value:'BNYS-II'},
      {label:'P.G.D-YOGA' , value:'PGD-YOGA%20I'},
      {label:'B.E.D Semester 1' , value:'BED%20I'},
      {label:'B.E.D Semester 2' , value:'BED%20II'},
      {label:'B.S.C-Agriculture Semester 1',value:'BSC-AG%20I'},
      {label:'B.S.C-Agriculture Semester 2',value:'BSC-AG%20II'},
      ])
      return
    }else if(course==='diploma'|| course==='diplomac'){
      setSemestersItem([
        { label: 'Diploma Semester1', value: '1' },
        { label: 'Diploma Semester 2', value: '2' },
        { label: 'Diploma Semester 3', value: '3' },
        { label: 'Diploma Semester 4', value: '4' },
        { label: 'Diploma Semester 5', value: '5' },
        { label: 'Diploma Semester 6', value: '6' },
        { label: 'DPHARMA Semester 1', value: 'DPHARM%20I' },
        { label: 'DPHARMA Semester 2', value: 'DPHARM%20II' },
      ])
    }
    
  } else if(session==='202021' ){
    if(course==='other'){
      setSemestersItem([  
        { label: 'UG & PG Semester1', value: '1' },
        { label: 'UG & PG Semester 2', value: '2' },
        { label: 'UG & PG Semester 3', value: '3' },
        { label: 'UG & PG Semester 4', value: '4' },
        { label: 'UG & PG Semester 5', value: '5' },
        { label: 'UG & PG Semester 6', value: '6' },
        { label: 'UG & PG Semester 7', value: '7' },
        { label: 'UG & PG Semester 8', value: '8' },
        { label: 'B.A.M.S Semester 1', value: 'BAMS%20I' },
        { label: 'B.A.M.S Semester 2', value: 'BAMS%20II' },
        { label: 'B.A.M.S Semester 3', value: 'BAMS%20III' },
        { label: 'B.A.M.S Semester 4', value: 'BAMS%20IV' },
        { label: 'B.A.M.S Semester 4-OCT20', value: 'BAMS%20IV-OCT20' },
      {label:'B.N.Y.S Semester 1' , value:'BNYS-I'},
      {label:'B.N.Y.S Semester 2' , value:'BNYS-II'},
      {label:'B.N.Y.S Semester 3' , value:'BNYS-III'},
      {label:'B.N.Y.S Semester 4' , value:'BNYS-IV'},
      {label:'P.G.D-YOGA' , value:'PGD-YOGA%20I'},
      {label:'B.E.D Semester 1' , value:'BED%20I'},
      {label:'B.E.D Semester 2' , value:'BED%20II'},
      {label:'B.A YOGA',value:'BA%20YOGA'},
      ])
      return
    }else if(course==='otherc'){
      setSemestersItem([  
        { label: 'UG & PG Semester1', value: '1' },
        { label: 'UG & PG Semester 2', value: '2' },
        { label: 'UG & PG Semester 3', value: '3' },
        { label: 'UG & PG Semester 4', value: '4' },
        { label: 'UG & PG Semester 5', value: '5' },
        { label: 'UG & PG Semester 6', value: '6' },
        { label: 'UG & PG Semester 7', value: '7' },
        { label: 'UG & PG Semester 8', value: '8' },
        { label: 'B.A.M.S Semester 1', value: 'BAMS%20I' },
        { label: 'B.A.M.S Semester 2', value: 'BAMS%20II' },
        { label: 'B.A.M.S Semester 3', value: 'BAMS%20III' },
        { label: 'B.A.M.S Semester 4', value: 'BAMS%20IV' },
        { label: 'B.A.M.S Semester 1-DEC21', value: 'BAMS%20I-DEC21' },
        { label: 'B.A.M.S Semester 2-DEC21', value: 'BAMS%20II-DEC21' },
        { label: 'B.A.M.S Semester 3-DEC21', value: 'BAMS%20III-DEC21' },
        { label: 'B.A.M.S Semester 4-DEC21', value: 'BAMS%20IV-DEC21' },
      {label:'B.N.Y.S Semester 1' , value:'BNYS-I'},
      {label:'B.N.Y.S Semester 2' , value:'BNYS-II'},
      {label:'P.G.D-YOGA' , value:'PGD-YOGA%20I'},
      {label:'B.E.D Semester 1' , value:'BED%20I'},
      {label:'B.E.D Semester 2' , value:'BED%20II'},
      {label:'B.S.C-Agriculture Semester 1',value:'BSC-AG%20I'},
      {label:'B.A YOGA',value:'BA%20YOGA'},
      {label:'B.A YOGA',value:'BA%20YOGA'},     
      ])
      return
    }else if(course==='diploma'|| course==='diplomac'){
      setSemestersItem([
        { label: 'Diploma Semester1', value: '1' },
        { label: 'Diploma Semester 2', value: '2' },
        { label: 'Diploma Semester 3', value: '3' },
        { label: 'Diploma Semester 4', value: '4' },
        { label: 'Diploma Semester 5', value: '5' },
        { label: 'Diploma Semester 6', value: '6' },
        { label: 'DPHARMA Semester 1', value: 'DPHARM%20I' },
        { label: 'DPHARMA Semester 2', value: 'DPHARM%20II' },
      ])
    }
  }else if(session==='202122'){
    if(course==='other' || course==='bpodd'|| course==='bpeven'){
      setSemestersItem([  
        { label: 'UG & PG Semester1', value: '1' },
        { label: 'UG & PG Semester 2', value: '2' },
        { label: 'UG & PG Semester 3', value: '3' },
        { label: 'UG & PG Semester 4', value: '4' },
        { label: 'UG & PG Semester 5', value: '5' },
        { label: 'UG & PG Semester 6', value: '6' },
        { label: 'UG & PG Semester 7', value: '7' },
        { label: 'UG & PG Semester 8', value: '8' },
        { label: 'UG & PG Semester 9', value: '9' },
        { label: 'UG & PG Semester 10', value: '10' },
        { label: 'B.A.M.S Semester 1', value: 'BAMS%20I' },
        { label: 'B.A.M.S Semester 2', value: 'BAMS%20II' },
        { label: 'B.A.M.S Semester 3', value: 'BAMS%20III' },
        { label: 'B.A.M.S Semester 4', value: 'BAMS%20IV' },
        { label: 'B.A.M.S Semester 4-OCT20', value: 'BAMS%20IV-OCT20' },
      {label:'B.N.Y.S Semester 1' , value:'BNYS-I'},
      {label:'B.N.Y.S Semester 2' , value:'BNYS-II'},
      {label:'B.N.Y.S Semester 3' , value:'BNYS-III'},
      {label:'B.N.Y.S Semester 4' , value:'BNYS-IV'},
      {label:'P.G.D-YOGA' , value:'PGD-YOGA%20I'},
      {label:'B.E.D Semester 1' , value:'BED%20I'},
      {label:'B.E.D Semester 2' , value:'BED%20II'},
      {label:'B.A YOGA',value:'BA%20YOGA'},   
      ])
      return
    }else if(course==='otherc'){
      setSemestersItem([  
        { label: 'UG & PG Semester1', value: '1' },
        { label: 'UG & PG Semester 2', value: '2' },
        { label: 'UG & PG Semester 3', value: '3' },
        { label: 'UG & PG Semester 4', value: '4' },
        { label: 'UG & PG Semester 5', value: '5' },
        { label: 'UG & PG Semester 6', value: '6' },
        { label: 'UG & PG Semester 7', value: '7' },
        { label: 'UG & PG Semester 8', value: '8' },
        { label: 'UG & PG Semester 9', value: '9' },
        { label: 'UG & PG Semester 10', value: '10' },
        { label: 'B.A.M.S Semester 1', value: 'BAMS%20I' },
        { label: 'B.A.M.S Semester 2', value: 'BAMS%20II' },
        { label: 'B.A.M.S Semester 3', value: 'BAMS%20III' },
        { label: 'B.A.M.S Semester 4', value: 'BAMS%20IV' },
        { label: 'B.A.M.S Semester 1-OCT22', value: 'BAMS%20IV-OCT22' },
        { label: 'B.A.M.S Semester 2-OCT22', value: 'BAMS%20IV-OCT22' },
        { label: 'B.A.M.S Semester 2-APR23', value: 'BAMS%20IV-APR23' },
        { label: 'B.A.M.S Semester 3-OCT22', value: 'BAMS%20IV-OCT22' },
        { label: 'B.A.M.S Semester 3-JAN23', value: 'BAMS%20IV-JAN23' },
        { label: 'B.A.M.S Semester 4-JAN23', value: 'BAMS%20IV-JAN23' },
        { label: 'B.A.M.S Semester 4-APR23', value: 'BAMS%20IV-APR23' },
      {label:'B.N.Y.S Semester 1' , value:'BNYS-I'},
      {label:'B.N.Y.S Semester 2' , value:'BNYS-II'},
      {label:'B.N.Y.S Semester 3' , value:'BNYS-III'},
      {label:'B.N.Y.S Semester 4' , value:'BNYS-IV'},
      {label:'P.G.D-YOGA' , value:'PGD-YOGA%20I'},
      {label:'B.E.D Semester 1' , value:'BED%20I'},
      {label:'B.E.D Semester 2' , value:'BED%20II'},
      {label:'B.A YOGA',value:'BA%20YOGA'},   
      ])
      return
    }else if(course==='bpspc'){
      setSemestersItem([  
        { label: 'UG & PG Semester1', value: '1' },
        { label: 'UG & PG Semester 2', value: '2' },
        { label: 'UG & PG Semester 3', value: '3' },
        { label: 'UG & PG Semester 4', value: '4' },
        { label: 'UG & PG Semester 5', value: '5' },
        { label: 'UG & PG Semester 6', value: '6' },
        { label: 'UG & PG Semester 7', value: '7' },
        { label: 'UG & PG Semester 8', value: '8' },])
        return
    }else if(course==='diploma'|| course==='diplomac'){
      setSemestersItem([
        { label: 'Diploma Semester1', value: '1' },
        { label: 'Diploma Semester 2', value: '2' },
        { label: 'Diploma Semester 3', value: '3' },
        { label: 'Diploma Semester 4', value: '4' },
        { label: 'Diploma Semester 5', value: '5' },
        { label: 'Diploma Semester 6', value: '6' },
        { label: 'DPHARMA Semester 1', value: 'DPHARM%20I' },
        { label: 'DPHARMA Semester 2', value: 'DPHARM%20II' },
      ])
    }

  }else if(session==='202223' ||session==='202324'){
    if(course==='other' ){
      setSemestersItem([  
        { label: 'UG & PG Semester1', value: '1' },
        { label: 'UG & PG Semester 2', value: '2' },
        { label: 'UG & PG Semester 3', value: '3' },
        { label: 'UG & PG Semester 4', value: '4' },
        { label: 'UG & PG Semester 5', value: '5' },
        { label: 'UG & PG Semester 6', value: '6' },
        { label: 'UG & PG Semester 7', value: '7' },
        { label: 'UG & PG Semester 8', value: '8' },
        { label: 'UG & PG Semester 9', value: '9' },
        { label: 'UG & PG Semester 10', value: '10' },
        { label: 'B.A.M.S Semester 1', value: 'BAMS%20I' },
        { label: 'B.A.M.S Semester 2', value: 'BAMS%20II' },
        { label: 'B.A.M.S Semester 3', value: 'BAMS%20III' },
        { label: 'B.A.M.S Semester 4', value: 'BAMS%20IV' },
      {label:'B.N.Y.S Semester 1' , value:'BNYS-I'},
      {label:'B.N.Y.S Semester 2' , value:'BNYS-II'},
      {label:'B.N.Y.S Semester 3' , value:'BNYS-III'},
      {label:'B.N.Y.S Semester 4' , value:'BNYS-IV'},
      {label:'P.G.D-YOGA' , value:'PGD-YOGA%20I'},
      {label:'B.E.D Semester 1' , value:'BED%20I'},
      {label:'B.E.D Semester 2' , value:'BED%20II'},
      {label:'B.A YOGA',value:'BA%20YOGA'},   
      {label:'PG AYURVEDA',value:'PG%AYURVEDA'},   
      ])
      return
    }else if(course==='otherc'|| course==='otheroddc'||course==='otherevenc'){
      setSemestersItem([  
        { label: 'UG & PG Semester1', value: '1' },
        { label: 'UG & PG Semester 2', value: '2' },
        { label: 'UG & PG Semester 3', value: '3' },
        { label: 'UG & PG Semester 4', value: '4' },
        { label: 'UG & PG Semester 5', value: '5' },
        { label: 'UG & PG Semester 6', value: '6' },
        { label: 'UG & PG Semester 7', value: '7' },
        { label: 'UG & PG Semester 8', value: '8' },
        { label: 'UG & PG Semester 9', value: '9' },
        { label: 'UG & PG Semester 10', value: '10' },
        { label: 'B.A.M.S Semester 1', value: 'BAMS%20I' },
        { label: 'B.A.M.S Semester 2', value: 'BAMS%20II' },
        { label: 'B.A.M.S Semester 3', value: 'BAMS%20III' },
        { label: 'B.A.M.S Semester 4', value: 'BAMS%20IV' },

        { label: 'B.A.M.S Semester 1-OCT22', value: 'BAMS%20I-OCT22' },
        { label: 'B.A.M.S Semester 2-OCT22', value: 'BAMS%20II-OCT22' },
        { label: 'B.A.M.S Semester 2-APR23', value: 'BAMS%20II-APR23' },
        { label: 'B.A.M.S Semester 3-DEC23', value: 'BAMS%20III-DEC23' },
        { label: 'B.A.M.S Semester 4-DEC23', value: 'BAMS%20IV-DEC23' },

      {label:'B.N.Y.S Semester 1' , value:'BNYS-I'},
      {label:'B.N.Y.S Semester 2' , value:'BNYS-II'},
      {label:'B.N.Y.S Semester 3' , value:'BNYS-III'},
      {label:'B.N.Y.S Semester 4' , value:'BNYS-IV'},
      {label:'P.G.D-YOGA' , value:'PGD-YOGA%20I'},
      {label:'B.E.D Semester 1' , value:'BED%20I'},
      {label:'B.E.D Semester 2' , value:'BED%20II'},
      {label:'B.A YOGA',value:'BA%20YOGA'},   
      ])
      return
    }else if(course==='bpodd' || course==='bpeven' || course==='bpspc'){
      setSemestersItem([
        { label: 'Semester 1', value: '1' },
        { label: 'Semester 2', value: '2' },
        { label: 'Semester 3', value: '3' },
        { label: 'Semester 4', value: '4' },
        { label: 'Semester 5', value: '5' },
        { label: 'Semester 6', value: '6' },
        { label: 'Semester 7', value: '7' },
        { label: 'Semester 8', value: '8' },
        
      ])
      return
    }else if(course==='diploma'|| course==='diplomac'){
      setSemestersItem([
        { label: 'Diploma Semester1', value: '1' },
        { label: 'Diploma Semester 2', value: '2' },
        { label: 'Diploma Semester 3', value: '3' },
        { label: 'Diploma Semester 4', value: '4' },
        { label: 'Diploma Semester 5', value: '5' },
        { label: 'Diploma Semester 6', value: '6' },
        { label: 'DPHARMA Semester 1', value: 'DPHARM%20I' },
        { label: 'DPHARMA Semester 2', value: 'DPHARM%20II' },
      ])
    }
  }

  },[course])

  return (
    <SafeAreaProvider>
   <SafeAreaView style={styles.container}>
  
      <Image source={{uri:'https://dli6r6oycdqaz.cloudfront.net/college-36/user-109260/30c39e6db4a149f89b6fd7f01e0cdde9_20210608_132206_36_109260_SUG_logo.png'}}
      style={styles.image} />
      <Text style={styles.header}>Shobhit University Gangoh</Text>
      <Text style={styles.subHeader}>Results</Text>

        
         <Picker 
        label="Select Session" 
        items={sessionItems}
        onValueChange={setSession} 
        value={session} 
      />

      <Picker 
        label="Select Your Course" 
        items={courseItem}
        onValueChange={setCourse} 
        value={course} 
      />
<Picker 
        label="Select Semester" 
        items={semestersitem}
        onValueChange={setSemester} 
        value={semester} 
      />

      <Text style={styles.label}>Enter Your Roll Number:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Roll Number"
        keyboardType="numeric"
        value={rollNumber}
        onChangeText={setRollNumber}
      />

      <TouchableOpacity onPress={viewResult} style={styles.button}>
        <Text style={styles.buttonText}>View Result</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#5e46b4" />}
  </SafeAreaView>
    </SafeAreaProvider>
  );
};





const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: 'white', // White background
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#4A4A4A', // Dark gray for better contrast
      marginBottom: 10,
      textAlign: 'center',
    },
    subHeader: {
      fontSize: 20,
      fontWeight: '600',
      color: '#555555', // Medium-dark gray
      marginBottom: 30,
      textAlign: 'center',
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: '#666666', // Slightly lighter gray for labels
      marginBottom: 5,
      alignSelf: 'flex-start',
    },
    input: {
      width: '100%',
      height: 40,
      borderColor: '#AAAAAA', // Light gray border to differentiate from white
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
      backgroundColor: '#F8F8F8', // Light gray background for input fields
      color: '#333333', // Dark text inside inputs
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#5e46b4', // Keep purple button for a strong color accent
      padding: 12,
      borderRadius: 10,
      marginBottom: 20,
      width: '80%',
    },
    buttonText: {
      fontSize: 18,
      color: 'white', // Keep white text for the purple button
      textAlign: 'center',
    },
    image: {
      width: 150,
      height: 150,
      resizeMode: 'contain',
      marginBottom: 20,
    },
  });
  
 const pickerStyles = {
    inputAndroid: {
      width: '100%',
      height: 50,
      backgroundColor: '#F8F8F8',
      borderRadius: 10,
      borderColor: '#AAAAAA', // Light gray border
      borderWidth: 1,
      paddingHorizontal: 10,
      fontSize: 16,
      color: '#333333', // Dark gray text
      marginBottom: 20,
    },
    inputIOS: {
      width: '100%',
      height: 50,
      backgroundColor: '#F8F8F8',
      borderRadius: 8,
      borderColor: '#AAAAAA',
      borderWidth: 1,
      paddingHorizontal: 10,
      fontSize: 16,
      color: '#333333',
      marginBottom: 20,
    },
  };
  export default Homepage;