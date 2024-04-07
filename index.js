var axios = require('axios');

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
let computerScienceEntry = {
    rank:"",
    school:"",
    name:"",
    code:"",    

};
axios
    .get('https://postings.speechwire.com/r-uil-academics.php?groupingid=9&Submit=View+postings&district=6&conference=6&seasonid=16')
    .then((res) => {
        console.log(res.data);
    })
    .catch((err) => console.error(err))