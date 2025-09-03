import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Save selected data
export const saveSelectedData = async (session, course, semester, rollNumber) => {
  try {
    const data = { session, course, semester, rollNumber };
    await AsyncStorage.setItem('userSelection', JSON.stringify(data));
  } catch (error) {
    console.error("❌ Error saving selection:", error);
  }
};

// ✅ Get selected data
export const getSelectedData = async () => {
  try {
    const value = await AsyncStorage.getItem('userSelection');
    if (value !== null) {
      return JSON.parse(value);
    }
    return null;
  } catch (error) {
    console.error("❌ Error retrieving selection:", error);
    return null;
  }
};

// ✅ (Optional) Clear selected data
export const clearSelectedData = async () => {
  try {
    await AsyncStorage.removeItem('userSelection');
    console.log("🧹 Selection cleared");
  } catch (error) {
    console.error("❌ Error clearing selection:", error);
  }
};
