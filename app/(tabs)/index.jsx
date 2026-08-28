import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

import SessionSelectModal from '@/components/SessionSelectModal';
import LoadingIndicator from '@/components/ActivityIndicator';
import Logo from '@/components/logo';

import getSessionDropdownOptions from '@/src/helper/getSessionDropdownOptions';
import GetResults from '@/src/helper/GetResult';
import {
  getSelectedData,
  saveSelectedData,
  getSearchHistory,
  saveSearchHistory,
  deleteSearchHistoryItem,
  clearSearchHistory,
} from '@/src/helper/storage';

import coursesConfig from '@/src/config/coursesConfig.json';
import semesterconfig from '@/src/config/semesterConfig.json';

export default function Homepage() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);

  const [session, setSession] = useState('');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  const [isSessionSelected, setSessionSelected] = useState(false);
  const [isCourseSelected, setCourseSelected] = useState(false);
  const [isSemesterSelected, setSemesterSelected] = useState(false);

  const [sessionModalVisible, setSessionModalVisible] = useState(false);
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [semesterModalVisible, setSemesterModalVisible] = useState(false);

  // Memoized dropdown data for fast rendering
  const sessionItems = useMemo(() => getSessionDropdownOptions(), []);

  const courseItem = useMemo(() => {
    return coursesConfig[session]?.courses || coursesConfig.default?.courses || [];
  }, [session]);

  const semestersItem = useMemo(() => {
    if (session && course) {
      return (
        semesterconfig[session]?.[course] ||
        semesterconfig.default?.[course] ||
        []
      );
    }
    return [];
  }, [session, course]);

  // Load saved selection and search history when app starts
  const loadInitialData = useCallback(async () => {
    try {
      const [savedData, history] = await Promise.all([
        getSelectedData(),
        getSearchHistory(),
      ]);

      if (history) {
        setSearchHistory(history);
      }

      if (savedData) {
        if (savedData.session) {
          setSession(savedData.session);
          setSessionSelected(true);
        }
        if (savedData.course) {
          setCourse(savedData.course);
          setCourseSelected(true);
        }
        if (savedData.semester) {
          setSemester(savedData.semester);
          setSemesterSelected(true);
        }
        if (savedData.rollNumber) {
          setRollNumber(String(savedData.rollNumber));
        }
      }
    } catch (error) {
      console.log('Error loading saved selection:', error);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Dropdown state handler
  const dropDownMenuHandler = (value, type) => {
    try {
      Haptics.selectionAsync();
    } catch (_e) {}

    if (type === 'session') {
      setSession(value);
      setSessionSelected(!!value);
      // Reset dependent selections if session changes
      if (value !== session) {
        setCourse('');
        setCourseSelected(false);
        setSemester('');
        setSemesterSelected(false);
      }
    }

    if (type === 'course') {
      setCourse(value);
      setCourseSelected(!!value);
      if (value !== course) {
        setSemester('');
        setSemesterSelected(false);
      }
    }

    if (type === 'semester') {
      setSemester(value);
      setSemesterSelected(!!value);
    }
  };

  // Prefill from history card
  const handleSelectFromHistory = (item) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_e) {}

    setSession(item.session);
    setSessionSelected(true);
    setCourse(item.course);
    setCourseSelected(true);
    setSemester(item.semester);
    setSemesterSelected(true);
    setRollNumber(String(item.rollNumber));

    if (Platform.OS === 'android') {
      ToastAndroid.show(`Loaded Roll No: ${item.rollNumber}`, ToastAndroid.SHORT);
    }
  };

  // Delete an individual history item
  const handleDeleteHistory = async (itemId) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const updated = await deleteSearchHistoryItem(itemId);
      setSearchHistory(updated);
    } catch (error) {
      console.log('Error deleting history item:', error);
    }
  };

  // Clear all search history
  const handleClearAllHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all previously checked result history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const updated = await clearSearchHistory();
            setSearchHistory(updated);
          },
        },
      ]
    );
  };

  // Reset all form inputs
  const handleResetForm = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_e) {}
    setSession('');
    setSessionSelected(false);
    setCourse('');
    setCourseSelected(false);
    setSemester('');
    setSemesterSelected(false);
    setRollNumber('');
  };

  // Handle "View Result" action
  const handleViewResult = async () => {
    if (!session || !course || !semester || !rollNumber) {
      Alert.alert('Required Fields', 'Please complete all selection steps and enter your roll number.');
      return;
    }

    if (rollNumber.trim().length < 6) {
      Alert.alert('Invalid Roll Number', 'Roll number must be at least 6 digits.');
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_e) {}

    setLoading(true);

    const sessionObj = sessionItems.find((item) => item.value === session);
    const courseObj = courseItem.find((item) => item.value === course);
    const semesterObj = semestersItem.find((item) => item.value === semester);

    // Save as last selection
    await saveSelectedData(session, course, semester, rollNumber.trim());

    // Call result API
    const success = await GetResults(course, session, rollNumber.trim(), semester);

    if (success) {
      // Record into search history
      const updatedHistory = await saveSearchHistory({
        rollNumber: rollNumber.trim(),
        session,
        sessionLabel: sessionObj?.label || session,
        course,
        courseLabel: courseObj?.label || course,
        semester,
        semesterLabel: semesterObj?.label || semester,
      });
      setSearchHistory(updatedHistory);
    }

    setLoading(false);
  };

  // Helper labels
  const selectedSessionLabel = sessionItems.find((item) => item.value === session)?.label;
  const selectedCourseLabel = courseItem.find((item) => item.value === course)?.label;
  const selectedSemesterLabel = semestersItem.find((item) => item.value === semester)?.label;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F8FAFC' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 16) + 4,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 🏛️ University Header Banner */}
          <View style={styles.headerCard}>
            <View style={styles.logoBadgeContainer}>
              <Logo size={88} />
            </View>
            <Text style={styles.universityTitle}>Shobhit University</Text>
            <Text style={styles.campusSubtitle}>GANGOH, SAHARANPUR</Text>
            <View style={styles.gradeSheetBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#4338CA" style={{ marginRight: 4 }} />
              <Text style={styles.gradeSheetText}>PROVISIONAL GRADE SHEET PORTAL</Text>
            </View>
          </View>

          {/* 🔢 Step Flow Indicator */}
          <View style={styles.stepsBar}>
            <View style={[styles.stepItem, isSessionSelected && styles.stepItemCompleted]}>
              <View style={[styles.stepNumber, isSessionSelected && styles.stepNumberCompleted]}>
                {isSessionSelected ? (
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                ) : (
                  <Text style={styles.stepNumberText}>1</Text>
                )}
              </View>
              <Text style={[styles.stepLabel, isSessionSelected && styles.stepLabelActive]}>Session</Text>
            </View>
            <View style={[styles.stepConnector, isSessionSelected && styles.stepConnectorActive]} />

            <View style={[styles.stepItem, isCourseSelected && styles.stepItemCompleted]}>
              <View style={[styles.stepNumber, isCourseSelected && styles.stepNumberCompleted]}>
                {isCourseSelected ? (
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                ) : (
                  <Text style={styles.stepNumberText}>2</Text>
                )}
              </View>
              <Text style={[styles.stepLabel, isCourseSelected && styles.stepLabelActive]}>Course</Text>
            </View>
            <View style={[styles.stepConnector, isCourseSelected && styles.stepConnectorActive]} />

            <View style={[styles.stepItem, isSemesterSelected && styles.stepItemCompleted]}>
              <View style={[styles.stepNumber, isSemesterSelected && styles.stepNumberCompleted]}>
                {isSemesterSelected ? (
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                ) : (
                  <Text style={styles.stepNumberText}>3</Text>
                )}
              </View>
              <Text style={[styles.stepLabel, isSemesterSelected && styles.stepLabelActive]}>Semester</Text>
            </View>
            <View style={[styles.stepConnector, isSemesterSelected && styles.stepConnectorActive]} />

            <View style={[styles.stepItem, rollNumber.length >= 6 && styles.stepItemCompleted]}>
              <View style={[styles.stepNumber, rollNumber.length >= 6 && styles.stepNumberCompleted]}>
                {rollNumber.length >= 6 ? (
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                ) : (
                  <Text style={styles.stepNumberText}>4</Text>
                )}
              </View>
              <Text style={[styles.stepLabel, rollNumber.length >= 6 && styles.stepLabelActive]}>Roll No</Text>
            </View>
          </View>

          {/* 📋 Form Card Container */}
          <View style={styles.formCard}>
            {/* Step 1: Session Selector */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Ionicons name="calendar-outline" size={16} color="#4338CA" style={styles.fieldIcon} />
                <Text style={styles.fieldLabel}>Academic Session</Text>
                {session ? (
                  <Text style={styles.selectedBadgePill}>Selected</Text>
                ) : (
                  <Text style={styles.requiredAsterisk}>*</Text>
                )}
              </View>
              <TouchableOpacity
                style={[styles.selectorButton, session ? styles.selectorButtonActive : null]}
                activeOpacity={0.7}
                onPress={() => setSessionModalVisible(true)}
              >
                <Text style={session ? styles.selectorText : styles.placeholderText} numberOfLines={1}>
                  {selectedSessionLabel || 'Select Academic Session'}
                </Text>
                <Ionicons name="chevron-down" size={18} color={session ? '#4338CA' : '#94A3B8'} />
              </TouchableOpacity>
            </View>

            {/* Step 2: Course Selector */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Ionicons
                  name="school-outline"
                  size={16}
                  color={isSessionSelected ? '#4338CA' : '#94A3B8'}
                  style={styles.fieldIcon}
                />
                <Text style={[styles.fieldLabel, !isSessionSelected && styles.disabledText]}>Course / Stream</Text>
                {course ? (
                  <Text style={styles.selectedBadgePill}>Selected</Text>
                ) : (
                  <Text style={styles.requiredAsterisk}>*</Text>
                )}
              </View>
              <TouchableOpacity
                style={[
                  styles.selectorButton,
                  !isSessionSelected && styles.selectorDisabled,
                  course ? styles.selectorButtonActive : null,
                ]}
                activeOpacity={0.7}
                onPress={() => isSessionSelected && setCourseModalVisible(true)}
                disabled={!isSessionSelected}
              >
                <Text
                  style={
                    !isSessionSelected
                      ? styles.disabledPlaceholderText
                      : course
                      ? styles.selectorText
                      : styles.placeholderText
                  }
                  numberOfLines={1}
                >
                  {!isSessionSelected
                    ? 'Select Session First'
                    : selectedCourseLabel || 'Select Your Course'}
                </Text>
                <Ionicons
                  name={!isSessionSelected ? 'lock-closed-outline' : 'chevron-down'}
                  size={16}
                  color={course ? '#4338CA' : '#94A3B8'}
                />
              </TouchableOpacity>
            </View>

            {/* Step 3: Semester Selector */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Ionicons
                  name="book-outline"
                  size={16}
                  color={isCourseSelected ? '#4338CA' : '#94A3B8'}
                  style={styles.fieldIcon}
                />
                <Text style={[styles.fieldLabel, !isCourseSelected && styles.disabledText]}>Semester / Year</Text>
                {semester ? (
                  <Text style={styles.selectedBadgePill}>Selected</Text>
                ) : (
                  <Text style={styles.requiredAsterisk}>*</Text>
                )}
              </View>
              <TouchableOpacity
                style={[
                  styles.selectorButton,
                  !isCourseSelected && styles.selectorDisabled,
                  semester ? styles.selectorButtonActive : null,
                ]}
                activeOpacity={0.7}
                onPress={() => isCourseSelected && setSemesterModalVisible(true)}
                disabled={!isCourseSelected}
              >
                <Text
                  style={
                    !isCourseSelected
                      ? styles.disabledPlaceholderText
                      : semester
                      ? styles.selectorText
                      : styles.placeholderText
                  }
                  numberOfLines={1}
                >
                  {!isCourseSelected
                    ? 'Select Course First'
                    : selectedSemesterLabel || 'Select Semester'}
                </Text>
                <Ionicons
                  name={!isCourseSelected ? 'lock-closed-outline' : 'chevron-down'}
                  size={16}
                  color={semester ? '#4338CA' : '#94A3B8'}
                />
              </TouchableOpacity>
            </View>

            {/* Step 4: Roll Number Input */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Ionicons
                  name="id-card-outline"
                  size={16}
                  color={isSemesterSelected ? '#4338CA' : '#94A3B8'}
                  style={styles.fieldIcon}
                />
                <Text style={[styles.fieldLabel, !isSemesterSelected && styles.disabledText]}>
                  Roll / Enrollment Number
                </Text>
                <Text style={styles.requiredAsterisk}>*</Text>
              </View>
              <View
                style={[
                  styles.inputWrapper,
                  !isSemesterSelected && styles.selectorDisabled,
                  rollNumber ? styles.inputWrapperActive : null,
                ]}
              >
                <TextInput
                  editable={isSemesterSelected && !loading}
                  style={styles.textInput}
                  placeholder={isSemesterSelected ? 'Enter 6 to 15 digit Roll Number' : 'Select Semester First'}
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={rollNumber}
                  maxLength={15}
                  onFocus={() => {
                    setTimeout(() => {
                      scrollViewRef.current?.scrollToEnd({ animated: true });
                    }, 250);
                  }}
                  onChangeText={(text) => {
                    const filtered = text.replace(/[^0-9]/g, '').slice(0, 15);
                    setRollNumber(filtered);
                    if (text.length >= 15 && Platform.OS === 'android') {
                      ToastAndroid.show('Maximum 15 digits allowed', ToastAndroid.SHORT);
                    }
                  }}
                />
                {rollNumber.length > 0 && (
                  <TouchableOpacity
                    style={styles.inputClearBtn}
                    onPress={() => setRollNumber('')}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close-circle" size={18} color="#94A3B8" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleViewResult}
              disabled={loading || rollNumber.length < 6 || !isSemesterSelected}
              style={[
                styles.primaryButton,
                (loading || rollNumber.length < 6 || !isSemesterSelected) && styles.primaryButtonDisabled,
              ]}
            >
              <Ionicons name="search" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.primaryButtonText}>
                {loading ? 'Fetching Result...' : 'View Provisional Result'}
              </Text>
            </TouchableOpacity>

            {/* Clear Form / Reset */}
            {(isSessionSelected || rollNumber.length > 0) && (
              <TouchableOpacity style={styles.resetButton} onPress={handleResetForm}>
                <Ionicons name="refresh-outline" size={15} color="#64748B" style={{ marginRight: 4 }} />
                <Text style={styles.resetButtonText}>Reset Form</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 🕒 Previously Checked Results Section */}
          {searchHistory.length > 0 && (
            <View style={styles.historySection}>
              <View style={styles.historyHeader}>
                <View style={styles.historyTitleRow}>
                  <Ionicons name="time-outline" size={18} color="#4338CA" style={{ marginRight: 6 }} />
                  <Text style={styles.historyTitle}>Recently Checked Results</Text>
                  <View style={styles.historyCountBadge}>
                    <Text style={styles.historyCountText}>{searchHistory.length}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={handleClearAllHistory} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.clearHistoryText}>Clear All</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.historySubtitle}>Tap any card below to instantly autofill details</Text>

              {searchHistory.map((item) => (
                <TouchableOpacity
                  key={item.id || item.rollNumber}
                  style={styles.historyCard}
                  activeOpacity={0.7}
                  onPress={() => handleSelectFromHistory(item)}
                >
                  <View style={styles.historyCardLeft}>
                    <View style={styles.historyIconCircle}>
                      <Ionicons name="person" size={16} color="#4338CA" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.historyRollRow}>
                        <Text style={styles.historyRollNumber}>Roll No: {item.rollNumber}</Text>
                        <View style={styles.historySessionBadge}>
                          <Text style={styles.historySessionText}>{item.sessionLabel}</Text>
                        </View>
                      </View>
                      <Text style={styles.historyCourseText} numberOfLines={1}>
                        {item.courseLabel}
                      </Text>
                      <Text style={styles.historySemesterText} numberOfLines={1}>
                        {item.semesterLabel}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.historyCardActions}>
                    <View style={styles.autofillActionBtn}>
                      <Ionicons name="arrow-up-circle" size={18} color="#4338CA" />
                      <Text style={styles.autofillActionText}>Fill</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteHistoryBtn}
                      onPress={() => handleDeleteHistory(item.id || item.rollNumber)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Footer Note */}
          <View style={styles.footerNoteContainer}>
            <Ionicons name="information-circle-outline" size={15} color="#94A3B8" style={{ marginRight: 4 }} />
            <Text style={styles.footerNoteText}>
              Official Grade Sheet Provisional Portal for Shobhit University Gangoh.
            </Text>
          </View>

          {/* Dropdown Modals */}
          <SessionSelectModal
            visible={sessionModalVisible}
            title="Select Academic Session"
            icon="calendar-outline"
            onClose={() => setSessionModalVisible(false)}
            items={sessionItems}
            selectedValue={session}
            onSelect={(val) => dropDownMenuHandler(val, 'session')}
          />

          <SessionSelectModal
            visible={courseModalVisible}
            title="Select Course / Stream"
            icon="school-outline"
            onClose={() => setCourseModalVisible(false)}
            items={courseItem}
            selectedValue={course}
            onSelect={(val) => dropDownMenuHandler(val, 'course')}
          />

          <SessionSelectModal
            visible={semesterModalVisible}
            title="Select Semester / Year"
            icon="book-outline"
            onClose={() => setSemesterModalVisible(false)}
            items={semestersItem}
            selectedValue={semester}
            onSelect={(val) => dropDownMenuHandler(val, 'semester')}
          />
        </ScrollView>
      </TouchableWithoutFeedback>

      {loading && <LoadingIndicator message="Connecting to university server and fetching result..." />}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#4338CA',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  logoBadgeContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEF2FF',
  },
  universityTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  campusSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1.2,
    marginTop: 2,
    marginBottom: 10,
  },
  gradeSheetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  gradeSheetText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338CA',
    letterSpacing: 0.4,
  },
  stepsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepItem: {
    alignItems: 'center',
  },
  stepItemCompleted: {},
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  stepNumberCompleted: {
    backgroundColor: '#4338CA',
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  stepLabelActive: {
    color: '#4338CA',
    fontWeight: '700',
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
    marginBottom: 12,
  },
  stepConnectorActive: {
    backgroundColor: '#4338CA',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  fieldGroup: {
    marginBottom: 15,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldIcon: {
    marginRight: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  requiredAsterisk: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
    marginLeft: 3,
  },
  selectedBadgePill: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  disabledText: {
    color: '#94A3B8',
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  selectorButtonActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#818CF8',
  },
  selectorDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.75,
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#94A3B8',
    flex: 1,
    marginRight: 8,
  },
  disabledPlaceholderText: {
    fontSize: 14,
    color: '#CBD5E1',
    flex: 1,
    marginRight: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  inputWrapperActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#818CF8',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    paddingVertical: 0,
  },
  inputClearBtn: {
    padding: 4,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4338CA',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 6,
    shadowColor: '#4338CA',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  primaryButtonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 6,
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  historySection: {
    marginBottom: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  historyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  historyCountBadge: {
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 1,
    marginLeft: 6,
  },
  historyCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338CA',
  },
  clearHistoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  historySubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  historyCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  historyIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  historyRollRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  historyRollNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginRight: 8,
  },
  historySessionBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  historySessionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  historyCourseText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4338CA',
  },
  historySemesterText: {
    fontSize: 11,
    color: '#64748B',
  },
  historyCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  autofillActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 8,
  },
  autofillActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338CA',
    marginLeft: 3,
  },
  deleteHistoryBtn: {
    padding: 6,
  },
  footerNoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  footerNoteText: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
  },
});

