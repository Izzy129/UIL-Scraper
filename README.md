## UIL Scraper - A Node.JS tool that scrapes UIL event scores from [Speechwire](https://postings.speechwire.com/r-uil-academics.php?seasonid=16)

## Installation & Usage
1. Install [Node.JS](https://nodejs.org/en/download). The latest LTS version should work fine.
2. Clone the repository via `git clone https://github.com/Izzy129/UIL-Scraper.git` or downloading ZIP through GitHub.
3. Extract the project to your desired folder, and do `npm install` to install the required dependencies.
4. Configure `config.json` to your liking.
     - `conference` refers to UIL Classification you would like to view the results for (1A, 2A, 3A, 4A, 5A, 6A) as a digit.
         - e.g. `6` is 6A
     - `eventID` refers to the UIL event you would like to view the results for (see [eventIDs.json](https://github.com/Izzy129/UIL-Scraper/blob/main/eventIDs.json) for reference).
         - e.g. `9` is for Computer Science.
     - `seasonID` is for the UIL season you would like to view results for.
         - e.g. `16` is for UIL season 2023-2024 (default).  
5. Run the scraper via `node index`, which will take **~10 seconds**.
6. A `.xlsx` Excel file will be created in your directory, based on the event and classification you chose. Each district is in a subsheet inside the workbook (near the bottom of Excel).

## To-do
- [ ] Give the option to create a megasheet of all conferences and districts.
- [ ] Move to a website for easier usage.
