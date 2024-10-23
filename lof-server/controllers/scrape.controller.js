const fetch = require('node-fetch');
const CsvData = require('../models/csvdata.model');

async function getShopMyToken() {
  const userId = process.env.SHOPMY_USER;
  const password = process.env.SHOPMY_PASS;
  const authUrl = 'https://api.shopmy.us/api/auth/login';
  try {
    console.log('Attempting to get ShopMy token...');
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, password }),
    });

    if (!response.ok) {
      console.log(`HTTP error! status: ${response.status}`);
      console.log('using hard coded token');
      return process.env.SHOPMY_TOKEN;
    }

    const data = await response.json();
    console.log('Received token:', data);
    return data.token;  // Return the token from the response data
  } catch (error) {
    console.error('Error getting ShopMy token:', error);
    throw error;
  }
}

async function fetchShopMyData(token, date) {
  const url = `https://api.shopmy.us/api/Pins?downloadAllToCsv=1&User_id=48231&sortDirection=desc&sortOrder=orderVolumeTotal&startDate=${date}&endDate=${date}&timezoneOffset=420&groupByMode=users&hideOtherRetailers=1`;
  console.log('Fetching data for date:', date);
  const headers = {
    'Accept-Encoding': 'application/gzip',
    'Content-Type': 'application/json',
    'Authorization': `${token}`,
  };

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Data fetch failed: ${response.status}`);
  }
  return response.json();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* exports.scrapeShopmyAndSave2DbRecent = async (req, res) => {
  try {
    const token = await getShopMyToken();
    let today = new Date();
    today.setDate(today.getDate() - 1);
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

    let currentDate = new Date(oneYearAgo);
    const results = [];

    while (currentDate <= today) {
      const dateString = currentDate.toISOString().split('T')[0];
      const fileName = `shopmy_report_${dateString}.json`;

      // Check if data for this date already exists
      const existingFile = await CsvData.findOne({ fileName: fileName });
      if (!existingFile) {
        const data = await fetchShopMyData(token, dateString);

        if (!data || typeof data !== 'object') {
          console.error(`Invalid data received for date: ${dateString}`);
        } else {
          const newCsvData = new CsvData({
            fileName: fileName,
            date: dateString,
            rawData: data,
            processedData: Object.values(data.results).map(item => ({
              name: item.User_name,
              username: item.username,
              instagram: item.social_links ? item.social_links.split(',').find(link => link.includes('instagram.com')) || '' : '',
              mentions: item.mentions,
              clicks: item.views,
              orderCount: item.ordersTotal,
              orderVolume: item.orderVolumeTotal,
              commissionsEarned: item.commissionTotal,
              estimatedMediaValue: item.estimatedMediaValue,
              firstLinked: item.createdAt,
              User_id: item.User_id,
              User_image: item.User_image,
              social_links: item.social_links,
              isPro: item.isPro,
              socials_linked: item.socials_linked
            })),
            uploadedAt: new Date()
          });

          await newCsvData.save();
          results.push({ date: dateString, status: 'success' });
        }
      } else {
        results.push({ date: dateString, status: 'skipped (already exists)' });
      }

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);

      // Wait for 30 seconds before the next iteration
      if (currentDate <= today) {
        await sleep(30000);
      }
    }

    res.json({ message: 'Shopmy data scraping completed', results: results });
  } catch (error) {
    console.error('Error scraping and saving Shopmy data:', error);
    res.status(500).json({ error: 'Failed to scrape and save Shopmy data', details: error.message });
  }
}; */

exports.scrapeShopmyAndSave2DbAll = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }
  // Start the scraping process in the background
  scrapeShopmyDataForAllDays(token)
    .then(() => res.json({ message: 'Finished scraping all ShopMy data' }))
    .catch(error => res.status(500).json({ error: 'Error scraping all ShopMy data', details: error.message }));

  // Immediately return a response to the client
  // res.json({ message: 'Started scraping all ShopMy data. This may take a while.' });
};

async function scrapeShopmyDataForAllDays(token) {
  try {
    //const token = await getShopMyToken();
    let today = new Date();
    today.setDate(today.getDate() - 1);
    today.setHours(today.getHours() - 7);
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

    // Generate all file names and dates for the year
    const allDates = [];
    let currentDate = new Date(oneYearAgo);
    while (currentDate <= today) {
      const dateString = currentDate.toISOString().split('T')[0];
      allDates.push({
        date: dateString,
        fileName: `shopmy_report_${dateString}.json`
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Batch check for existing files
    const existingFiles = await CsvData.find(
      { fileName: { $in: allDates.map(d => d.fileName) } },
      'fileName'
    );
    const existingFileSet = new Set(existingFiles.map(file => file.fileName));

    for (const { date, fileName } of allDates) {
      if (!existingFileSet.has(fileName)) {
        const data = await fetchShopMyData(token, date);

        if (data && typeof data === 'object') {
          const newCsvData = new CsvData({
            fileName: fileName,
            date: date,
            rawData: data,
            processedData: Object.values(data.results).map(item => ({
              name: item.User_name,
              username: item.username,
              instagram: item.social_links ? item.social_links.split(',').find(link => link.includes('instagram.com')) || '' : '',
              mentions: item.mentions,
              clicks: item.views,
              orderCount: item.ordersTotal,
              orderVolume: item.orderVolumeTotal,
              commissionsEarned: item.commissionTotal,
              estimatedMediaValue: item.estimatedMediaValue,
              firstLinked: item.createdAt,
              User_id: item.User_id,
              User_image: item.User_image,
              social_links: item.social_links,
              isPro: item.isPro,
              socials_linked: item.socials_linked
            })),
            uploadedAt: new Date()
          });

          await newCsvData.save();
          console.log(`Saved data for ${date}`);

          // Wait for 5 seconds before the next iteration
          await sleep(5000);
        } else {
          console.error(`Invalid data received for date: ${date}`);
        }
      } else {
        console.log(`Data for ${date} already exists, skipping`);
      }
    }
  } catch (error) {
    console.error('Error in scrapeShopmyDataForAllDays:', error);
    throw error;
  }
}

exports.deleteRecentCsvData = async (req, res) => {
  try {
    const { days } = req.body;

    if (!days || isNaN(days) || days <= 0) {
      return res.status(400).json({ error: 'Invalid number of days provided' });
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await CsvData.deleteMany({ date: { $gte: cutoffDate.toISOString().split('T')[0] } });

    if (result.deletedCount > 0) {
      res.json({ message: `Successfully deleted ${result.deletedCount} records from the last ${days} days.` });
    } else {
      res.json({ message: `No records found to delete from the last ${days} days.` });
    }
  } catch (error) {
    console.error('Error deleting recent CsvData:', error);
    res.status(500).json({ error: 'Failed to delete recent CsvData', details: error.message });
  }
};
