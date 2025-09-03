 // Function to dynamically generate session labels
  const getSessionDropdownOptions = () => {
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

export default getSessionDropdownOptions
