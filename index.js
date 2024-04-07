const axios = require('axios');
const cheerio = require('cheerio');
const XLSX = require('xlsx');

var { conference, eventID, seasonID } = require("./config.json");
const eventsJSON = require("./eventIDs.json");
const events = new Map(Object.entries(eventsJSON));

// https://postings.speechwire.com/r-uil-academics.php?conference=6&seasonid=16
// conference=6 -> 6a
// conference=5 -> 5a
// ...
// if not 1 through 5 then just default to selection page

// https://postings.speechwire.com/r-uil-academics.php?conference=6&district=31&seasonid=16
// district=31 -> district 31
// if not 1 through 31 then just default to selection page

/* https://postings.speechwire.com/r-uil-academics.php
        ?groupingid=9 // event # (in this case is comp sci)
        &Submit=View+postings // need this to see results
        // CAN BE REMOVE &region= // since we're in district region is blank
        &district=6 // district 6
        // CAN BE REMOVE &state= // since we're in district state is blank
        &conference=6 // 6a
        &seasonid=16 // 23-24 uil
*/

// make excel book

async function scrapeTableData(conference, eventID, seasonID) {

  return new Promise(async (resolve, reject) => {
    var wb = XLSX.utils.book_new();
    var district = 0;
    const missingDistricts = [];
    const postedDistricts = [];

    console.log("Conference: " + conference + "A");
    console.log("Event: " + events.get("" + eventID));
    console.log("Scraping scores, this will take ~10 seconds");
    console.log();
    while (++district <= 32) {
      try {
        var url = 'https://postings.speechwire.com/r-uil-academics.php?groupingid=' + eventID + '&Submit=View+postings&region=&district=' + district + '&state=&conference=' + conference + '&seasonid=' + seasonID;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        // grabs all table elements with <table> and <tr> tag
        const tableRows = $('table tr');
        var ws = XLSX.utils.aoa_to_sheet([[]]); // make new excel worksheet, we add to book later

        var cont = true;
        if (tableRows.length == 6) { // no results
          cont = false;
          missingDistricts.push(district);
        }
        if (cont) { // results
          postedDistricts.push(district); // for printing 

          // loop through table rows and extract data
          // we start at 6th row because first 6 rows have junk info
          tableRows.slice(6).each((index, element) => { 
            const rowData = [];
            $(element).find('td').each((i, el) => {
              rowData.push($(el).text().trim());
            });
            XLSX.utils.sheet_add_aoa(ws, [rowData], { origin: -1 });
          });

          // add worksheet to workbook
          XLSX.utils.book_append_sheet(wb, ws, 'District ' + district);

          // write to file
          XLSX.writeFile(wb, conference + "A " + events.get("" + eventID) + " Scores.xlsx");
        }
      } catch (error) {
        console.error('Error scraping table data:', error);
      }
    }
    var posted = events.get("" + eventID) + " "  + conference + "A Posted Districts: ";
    var missing = events.get("" + eventID) + " " + conference + "A Missing Districts: ";
    missingDistricts.forEach(d => {
      missing += d + ", ";
    });

    postedDistricts.forEach(d => {
      posted += d + ", ";
    });

    console.log(posted);
    console.log(missing);
    resolve();
  });
} // end of scrape function

// call main
async function main() {
  console.time("Script execution time");
  while (conference <= 6) {
    await scrapeTableData(conference, eventID, seasonID);
    conference++;
  }
  console.timeEnd("Script execution time");

}
main();