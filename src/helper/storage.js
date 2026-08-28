import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_SELECTION_KEY = 'userSelection';
const SEARCH_HISTORY_KEY = 'searchHistory';
const MAX_HISTORY_ITEMS = 15;

const inMemoryStore = new Map();

const safeGetItem = async (key) => {
  try {
    if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
      return await AsyncStorage.getItem(key);
    }
  } catch (e) {
    console.warn('Storage read fallback:', e);
  }
  return inMemoryStore.get(key) ?? null;
};

const safeSetItem = async (key, value) => {
  try {
    if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
      return await AsyncStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn('Storage write fallback:', e);
  }
  inMemoryStore.set(key, value);
};

const safeRemoveItem = async (key) => {
  try {
    if (AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
      return await AsyncStorage.removeItem(key);
    }
  } catch (e) {
    console.warn('Storage remove fallback:', e);
  }
  inMemoryStore.delete(key);
};

// Save last selected data for pre-fill
export const saveSelectedData = async (session, course, semester, rollNumber, extra = {}) => {
  try {
    const data = { session, course, semester, rollNumber, ...extra, updatedAt: Date.now() };
    await safeSetItem(USER_SELECTION_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving selection:', error);
  }
};

// Get last selected data for pre-fill
export const getSelectedData = async () => {
  try {
    const value = await safeGetItem(USER_SELECTION_KEY);
    if (value !== null) {
      return JSON.parse(value);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving selection:', error);
    return null;
  }
};

// Clear last selected data
export const clearSelectedData = async () => {
  try {
    await safeRemoveItem(USER_SELECTION_KEY);
  } catch (error) {
    console.error('Error clearing selection:', error);
  }
};

// Save a search record to history (adds new or moves existing to top)
export const saveSearchHistory = async (searchItem) => {
  try {
    const history = await getSearchHistory();
    const id = `${searchItem.rollNumber}_${searchItem.session}_${searchItem.course}_${searchItem.semester}`;
    const newItem = {
      id,
      rollNumber: String(searchItem.rollNumber).trim(),
      session: searchItem.session,
      sessionLabel: searchItem.sessionLabel || searchItem.session,
      course: searchItem.course,
      courseLabel: searchItem.courseLabel || searchItem.course,
      semester: searchItem.semester,
      semesterLabel: searchItem.semesterLabel || searchItem.semester,
      timestamp: Date.now(),
    };

    // Filter out previous duplicate entry if it exists
    const filteredHistory = history.filter((item) => item.id !== id && item.rollNumber !== newItem.rollNumber);
    const updatedHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);

    await safeSetItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (error) {
    console.error('Error saving search history:', error);
    return [];
  }
};

// Retrieve full search history
export const getSearchHistory = async () => {
  try {
    const value = await safeGetItem(SEARCH_HISTORY_KEY);
    if (value !== null) {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (error) {
    console.error('Error retrieving search history:', error);
    return [];
  }
};

// Delete a single history item by id or rollNumber
export const deleteSearchHistoryItem = async (itemId) => {
  try {
    const history = await getSearchHistory();
    const updatedHistory = history.filter((item) => item.id !== itemId && item.rollNumber !== itemId);
    await safeSetItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (error) {
    console.error('Error deleting search history item:', error);
    return [];
  }
};

// Clear entire search history
export const clearSearchHistory = async () => {
  try {
    await safeRemoveItem(SEARCH_HISTORY_KEY);
    return [];
  } catch (error) {
    console.error('Error clearing search history:', error);
    return [];
  }
};
