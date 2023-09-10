class ChartGenerator{
  /**
   * @param {*} context context of the chart
   * @param {object} response Contains all the data required for the stats
   * @param {object} chartParams 
   * @param {string} chartParams.chartType 
   * @param {string} chartParams.chartTitle 
   * @param {string} chartParams.titlePosition 
   * @param {Array} chartParams.sectionColors 
   * @param {string} chartParams.chartAxis
   * @param {number} chartParams.borderWidth
   * @param {string} chartParams.borderColor
   * @param {string} chartParams.chartSubtitle
   * @param {object} dataParams 
   * @param {string} dataParams.dataTitle data displayed when hovering
   * @param {boolean} dataParams.displayPercent 
   * @param {string} dataParams.percentageTitlePosition 
   * @param {string} dataParams.percentageTitleColor
   */
  generateChart(context, response, chartParams={chartType, chartTitle, titlePosition:'center', sectionColors:null, chartAxis:'x', borderWidth:0, bordercolor:null, chartSubtitle:null}, dataParams = {dataTitle, displayPercent:false, percentageTitlePosition:'center', percentageTitleColor:null}){
        let nbTab = [];
        let total = 0;
        
        for(let obj in response){
          if(response[obj].nb){
            nbTab.push(response[obj].nb);
            total+= response[obj].nb;
          }
        }

        const percentageLabel = (dataParams.displayPercent)? {
          color: dataParams.percentageTitleColor,
          fontSize: 16,
          formatter: (val) => {
            const percentage = (val/ total) * 100 ;
            const roundedPercentage = Math.round((percentage.toPrecision(3) * 100)) / 100
            return `${roundedPercentage}%`
          },
          labels: {title: 
            {font: 
              {weight: 'bold', size: 13},
              anchor: dataParams.percentageTitlePosition,
            }
          }
        }: {display: false};

        const chart = new Chart(context, 
        {
          type: chartParams.chartType,
          options: {
            plugins: {
              subtitle: {
                display: true,
                text: chartParams.chartSubtitle,
                position: 'bottom',
                padding: {
                  top: 22,
                  bottom: 5
                }
              },
              title: {
                display: true,
                text: chartParams.chartTitle,
                position:chartParams.titlePosition,
                font:{
                  size: 16
                }
              },
              value:{
                color: dataParams.percentageTitleColor
              },
              datalabels:percentageLabel
            },
            indexAxis: chartParams.chartAxis
          },
          data: {
            labels: response.labelTab,
            datasets: [
              {
                label: dataParams.dataTitle,
                data: nbTab,
                backgroundColor: chartParams.sectionColors,
                borderWidth: chartParams.borderWidth,
                borderColor: chartParams.borderColor,
                hoverOffset: 4
              }
            ]
          }
        });

        return chart;
    }

    /**
     * Destroys targeted charts whithin a canvas
     * @param {*} chartIdTab array containing all canvas id
     */
    deleteChart(chartIdTab){

      for(let chartId of chartIdTab){
          let chartStatus = Chart.getChart(chartId);

        if (chartStatus != undefined) {
          chartStatus.destroy();
        }
      }
    }
}