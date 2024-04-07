const axios = require('axios');
const cheerio = require('cheerio');
const XLSX = require('xlsx');
const fs = require('fs');
const { log } = require('console');

var eventID = 8; // overall school sweepstakes by default
var conference = 6;
// var district = 1;?
var seasonID = 16 // 16 is 23-24 uil
/*
*/
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

    console.log("CONFERENCE: " + conference);
    while (++district <= 32) {
      try {
        var url = 'https://postings.speechwire.com/r-uil-academics.php?groupingid=' + eventID + '&Submit=View+postings&region=&district=' + district + '&state=&conference=' + conference + '&seasonid=' + seasonID;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // grabs all table elements with <table> and <tr> tag
        const tableRows = $('table tr');
        var ws = XLSX.utils.aoa_to_sheet([[]]); // make new excel worksheet
        var cont = true;
        if (tableRows.length == 6) { // no results
          cont = false;
          missingDistricts.push(district);
        }
        if (cont) {
          postedDistricts.push(district);
          console.log("url: " + url);

          // loop through table rows and extract data
          // we start at 6th row because first 6 rows have junk info
          tableRows.slice(6).each((index, element) => {
            const rowData = [];
            $(element).find('td').each((i, el) => {
              rowData.push($(el).text().trim());
            });
            XLSX.utils.sheet_add_aoa(ws, [rowData], { origin: -1 });
          });

          // append worksheet to  workbook
          XLSX.utils.book_append_sheet(wb, ws, 'District ' + district);

          // write to file
          XLSX.writeFile(wb, conference + 'A Calculator Scores.xlsx');

          // console.log('Table scraped and saved to table_data.xlsx');
        }
      } catch (error) {
        console.error('Error scraping table data:', error);
      }
    }
    var posted = "Calculator " + conference + "A Posted Districts: ";
    var missing = "Calculator " + conference + "A Missing Districts: ";
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
    // return new Promise(async (resolve, reject)=>  {

    // })
    await scrapeTableData(conference, eventID, seasonID);
    conference++;
  }
  console.timeEnd("Script execution time");

}
main();