const fs = require('fs');

// Read the content of "result.txt"
fs.readFile('/Users/sha/Desktop/GA_project3/BE/result.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
  } else {
    // Extract data using regular expressions
    try {
      const restaurant1 = data;
      console.log(restaurant1)
      console.log(typeof restaurant1)

      const restaurantNameRegex = /Restaurant Name:\s*([^ ]*)/;
      const summaryRegex = /Summary:\s*([^ ]*)/;
      const latitudeRegex = /Latitude:\s*([^ ]*)\n/;
      const longitudeRegex = /Longitude:\s*([^ ]*)\n/;
      const sojournTimeRegex = /Recommended Sojourn Time:\s*([^ ]*)/;

      const restaurantNameMatch = restaurant1.match(restaurantNameRegex);
      console.log("check!!")
      console.log(restaurantNameMatch)
      const summaryMatch = restaurant1.match(summaryRegex);
      const latitudeMatch = restaurant1.match(latitudeRegex);
      const longitudeMatch = restaurant1.match(longitudeRegex);
      const sojournTimeMatch = restaurant1.match(sojournTimeRegex);

      const restaurant1__ = {
        "Restaurant Name": restaurantNameMatch ? restaurantNameMatch[1] : null,
        "Summary": summaryMatch ? summaryMatch[1] : null,
        "Location": {
          "Latitude": latitudeMatch ? latitudeMatch[1] : null,
          "Longitude": longitudeMatch ? longitudeMatch[1] : null,
        },
        "Recommended Sojourn Time": sojournTimeMatch ? sojournTimeMatch[1] : null,
      };

      console.log(restaurant1__);

      // Do whatever you need to do with the extracted data
    } catch (error) {
      console.error('Error extracting data:', error);
    }
  }
});
