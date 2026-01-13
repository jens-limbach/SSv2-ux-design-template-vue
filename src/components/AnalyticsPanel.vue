<script setup lang="ts">
import { computed } from 'vue'
import { Chart } from 'highcharts-vue'

interface Props {
  analyticsData: { industry: string; priority: string; country: string }[]
}

const props = defineProps<Props>()

// Calculate Accounts by Industry
const accountsByIndustry = computed(() => {
  const industryCount = props.analyticsData.reduce((acc, item) => {
    acc[item.industry] = (acc[item.industry] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(industryCount).map(([name, y]) => ({ name, y }))
})

// Calculate Accounts by Priority
const accountsByPriority = computed(() => {
  const priorityCount = props.analyticsData.reduce((acc, item) => {
    acc[item.priority] = (acc[item.priority] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 }
  const priorityColors = { 'High': '#ED8B8B', 'Medium': '#F9C85A', 'Low': '#5899DA' }
  
  return Object.entries(priorityCount)
    .sort(([a], [b]) => priorityOrder[a as keyof typeof priorityOrder] - priorityOrder[b as keyof typeof priorityOrder])
    .map(([name, y]) => ({ 
      name, 
      y,
      color: priorityColors[name as keyof typeof priorityColors]
    }))
})

// Calculate Accounts by Country
const accountsByCountry = computed(() => {
  const countryCount = props.analyticsData.reduce((acc, item) => {
    acc[item.country] = (acc[item.country] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(countryCount)
    .sort(([, a], [, b]) => b - a) // Sort by count descending
    .map(([name, y]) => ({ name, y }))
})

// Pie Chart Options - Accounts by Industry
const pieChartOptions = computed(() => ({
  chart: {
    type: 'pie' as const,
    height: 240
  },
  title: {
    text: 'Accounts by Industry',
    style: {
      fontFamily: '"72", Helvetica, -apple-system, Arial, sans-serif',
      fontSize: '1rem',
      fontWeight: '600',
      color: '#32363A'
    }
  },
  credits: {
    enabled: false
  },
  tooltip: {
    pointFormat: '<b>{point.y}</b> accounts ({point.percentage:.1f}%)'
  },
  legend: {
    enabled: false
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '{point.name}: {point.percentage:.1f}%',
        style: {
          fontFamily: '"72", Helvetica, -apple-system, Arial, sans-serif',
          fontSize: '0.75rem',
          fontWeight: '600',
          textOutline: 'none'
        },
        distance: 10
      },
      showInLegend: false,
      colors: ['#5899DA', '#7CB5EC', '#A8D5BA', '#F9C85A', '#ED8B8B', '#B399D9', '#6DC4D9', '#E87EB8', '#C17AD6', '#95C5E8']
    }
  },
  series: [{
    type: 'pie' as const,
    name: 'Accounts',
    colorByPoint: true,
    data: accountsByIndustry.value
  }]
}))

// Column Chart Options - Accounts by Priority
const columnChartOptions = computed(() => ({
  chart: {
    type: 'column' as const,
    height: 240
  },
  title: {
    text: 'Accounts by Priority',
    style: {
      fontFamily: '"72", Helvetica, -apple-system, Arial, sans-serif',
      fontSize: '1rem',
      fontWeight: '600',
      color: '#32363A'
    }
  },
  credits: {
    enabled: false
  },
  xAxis: {
    type: 'category' as const,
    labels: {
      style: {
        fontFamily: '"72", Helvetica, -apple-system, Arial, sans-serif',
        fontSize: '0.875rem'
      }
    }
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Number of Accounts',
      style: {
        fontFamily: '"72", Helvetica, -apple-system, Arial, sans-serif',
        fontSize: '0.875rem'
      }
    },
    labels: {
      style: {
        fontFamily: '"72", Helvetica, -apple-system, Arial, sans-serif',
        fontSize: '0.875rem'
      }
    }
  },
  legend: {
    enabled: false
  },
  tooltip: {
    pointFormat: '<b>{point.y}</b> accounts'
  },
  plotOptions: {
    column: {
      colorByPoint: true,
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: '"72", Helvetica, -apple-system, Arial, sans-serif',
          fontSize: '0.875rem',
          fontWeight: '600'
        }
      }
    }
  },
  series: [{
    type: 'column' as const,
    name: 'Accounts',
    data: accountsByPriority.value
  }]
}))

// Column Chart Options - Accounts by Country
const countryChartOptions = computed(() => ({
  chart: {
    type: 'column' as const,
    height: 240
  },
  title: {
    text: 'Accounts by Country',
    style: {
      fontFamily: '"72", Helvetica, -apple-system, Arial, sans-serif',
      fontSize: '1rem',
      fontWeight: '600',
      color: '#32363A'
    }
  },
  credits: {
    enabled: false
  },
  xAxis: {
    type: 'category' as const,
    labels: {
      style: {
        fontFamily: '"72", Helvetica, -apple-system, Arial, sans-serif',
        fontSize: '0.875rem'
      }
    }
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Number of Accounts',
      style: {
        fontFamily: '"72", Helvetica, -apple-system, Arial, sans-serif',
        fontSize: '0.875rem'
      }
    },
    labels: {
      style: {
        fontFamily: '"72", Helvetica, -apple-system, Arial, sans-serif',
        fontSize: '0.875rem'
      }
    }
  },
  legend: {
    enabled: false
  },
  tooltip: {
    pointFormat: '<b>{point.y}</b> accounts'
  },
  plotOptions: {
    column: {
      colorByPoint: true,
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: '"72", Helvetica, -apple-system, Arial, sans-serif',
          fontSize: '0.875rem',
          fontWeight: '600'
        }
      },
      colors: ['#5899DA', '#7CB5EC', '#A8D5BA', '#F9C85A', '#ED8B8B', '#B399D9', '#6DC4D9']
    }
  },
  series: [{
    type: 'column' as const,
    name: 'Accounts',
    data: accountsByCountry.value
  }]
}))
</script>

<template>
  <div class="table-container analytics-container">
    <div class="table-header">
      <h1>Analytics Overview</h1>
    </div>
    <div class="analytics-panel__charts">
      <div class="analytics-panel__chart">
        <Chart :options="pieChartOptions" />
      </div>
      <div class="analytics-panel__chart">
        <Chart :options="columnChartOptions" />
      </div>
      <div class="analytics-panel__chart">
        <Chart :options="countryChartOptions" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.analytics-container {
  margin-bottom: 1.5rem;
}

.analytics-panel__charts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 1.5rem;
  width: 100%;
}

.analytics-panel__chart {
  background: white;
  border: 1px solid var(--color-neutral-2);
  border-radius: 0.25rem;
  padding: 1rem;
  min-height: 280px;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 1440px) {
  .analytics-panel__charts {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .analytics-panel__charts {
    grid-template-columns: 1fr;
  }
}
</style>
