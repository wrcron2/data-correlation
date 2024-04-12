import Papa from 'papaparse';
import csvFile from '../data/SS_218_24-10_24_12_filtered.csv'
import csvMixFile from '../data/sources_installs_mix_df.csv'

 

class App1Service {

  fetchCSV = async (csvFile) => {
    const response = await fetch(csvFile);
    const reader = response?.body?.getReader();
    const result = await reader?.read();
    const decoder = new TextDecoder('utf-8');
    const csv = await decoder.decode(result?.value);
    return csv;
  }

  convertRawDataCsvToJson = async () => {

    const data = Papa.parse(await this.fetchCSV(csvFile), { header: true,  delimiter: ",", // Make sure this is consistent with your CSV file's actual delimiter
    skipEmptyLines: true,
    dynamicTyping: true,
    quoteChar: '"', // The character used to quote fields that contain special characters
    escapeChar: '"',});

    const res = this.processMetricsData(data.data)
    return res

    }
  
  
  
  processMetricsData = (data) => {

        const constDataDict = {};
        const metrics = ['spend', 'installs', 'impressions', 'clicks', 'ad_revenue_d0'];
        

        // Assuming data is an array of objects where each object represents a row of the CSV.
        const uniqueApps = [...new Set(data.map(item => item.ref_app_id))];
        
        uniqueApps.forEach(app => {
          const appData = data.filter(item => item.ref_app_id === app);
          const constData = [];
          const uniqueDays = [...new Set(appData.map(item => item.day_date))];
          
          uniqueDays.forEach(day => {
            const dayData = appData.filter(item => item.day_date === day);
            const dayDict = { name: day };
            
            metrics.forEach(metric => {
              const metricSum = dayData.reduce((sum, record) => sum + parseFloat(record[metric] || 0), 0);
              dayDict[metric] = metricSum;
            });
            // @ts-ignore
            constData.push(dayDict);
          });
          // @ts-ignore
          constDataDict[app] = constData;
        });
        
        return constDataDict;
  };


  convertRawMixDataCsvToJson = async () => {
    const data = Papa.parse(await this.fetchCSV(csvMixFile), { header: true,  delimiter: ",", // Make sure this is consistent with your CSV file's actual delimiter
    skipEmptyLines: true,
    dynamicTyping: true,
    quoteChar: '"', // The character used to quote fields that contain special characters
    escapeChar: '"',});

    const res = this.processMixsData(data.data)
    return res
  }

  processMixsData = (data) => {
    const sourceMixData = data
    const constDataDict = {};
    const sources = [...new Set(sourceMixData.map(data => data.display_name))];
    sourceMixData.forEach(data => {
        const app = data.ref_app_id;
        if (!constDataDict[app]) {
            constDataDict[app] = [];
        }
        const appData = sourceMixData.filter(d => d.ref_app_id === app);
        const constData = [];
        appData.forEach(dayData => {
          const day = dayData.day_date;
          //@ts-ignore
            if (!constData.find(item => item.name === day)) {
                const dayInstallSum = appData
                    .filter(d => d.day_date === day)
                    .reduce((sum, d) => sum + parseInt(d.installs), 0);
                const dayDict = { name: day };
                sources.forEach(source => {
                    const installsSum = appData
                        .filter(d => d.day_date === day && d.display_name === source)
                        .reduce((sum, d) => sum + parseInt(d.installs), 0);
                  if (installsSum > 0) {
                                //@ts-ignore
                        dayDict[source] = (100 * installsSum) / dayInstallSum;
                    }
                });
                        //@ts-ignore

                constData.push(dayDict);
            }
        });
        constDataDict[app] = constData;
    });
    return constDataDict;
  }
  
}

export default new App1Service()



