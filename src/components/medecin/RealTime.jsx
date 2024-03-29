// /*
//  * LightningChartJS example that showcases a simulated ECG signal.
//  */
// // Import LightningChartJS

import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    TextField,
    Stack,
    Typography
  } from '@mui/material'
import React, { useState, useEffect,useRef, useMemo  } from "react";
// import {InfluxDB, Point} from 'https://unpkg.com/@influxdata/influxdb-client-browser/dist/index.browser.mjs'
import { lightningChart, AxisScrollStrategies,AxisTickStrategies, Themes, Axis, Color } from '@arction/lcjs'
import {createSampledDataGenerator,} from '@arction/xydata'
const { createProgressiveFunctionGenerator } = require('@arction/xydata')



// Import LightningChartJS
const RealTime = (props) => {
    const {data} = props
    const {result} = props
    const{bp}= props
    const{temp}= props

    const chartRef = useRef(undefined)

    console.log('bp from chart', bp)
useEffect(() => {

const chart = lightningChart().ChartXY({


    
    // container:id
    theme: Themes.lightNew, 
}).setTitle('ECG')
.setMouseInteractionsWhileScrolling(true)


// // Create line series optimized for regular progressive X data.
// const series = chart.addLineSeries(


//     {
//     dataPattern: {
//         // pattern: 'ProgressiveX' => Each consecutive data point has increased X coordinate.
//         pattern: 'ProgressiveX',
//         // regularProgressiveStep: true => The X step between each consecutive data point is regular (for example, always `1.0`).
//         regularProgressiveStep: true,
//     }
//  })
 chartRef.current = { chart }

    // Destroy automatically outscrolled data (old data becoming out of scrolling axis range).
    // Actual data cleaning can happen at any convenient time (not necessarily immediately when data goes out of range).
    // .setMaxPointCount(10000)
    // .setMouseInteractions(false)

// // Setup view nicely.
chart.getDefaultAxisY()
    .setTitle('ECG F')
    .setInterval(-6, 9)
    .setScrollStrategy(AxisScrollStrategies.expansion)

chart.getDefaultAxisX()
    .setTitle('milliseconds')
    .setInterval(0,3000)
    .setScrollStrategy(AxisScrollStrategies.progressive)
    .setTickStrategy(
    //     AxisTickStrategies.DateTime,
        (tickStrategy) => tickStrategy.setDateOrigin( new Date())
    )


    return () => {
        // Destroy chart.
        // console.log('destroy chart')
        chart.dispose()
        chartRef.current = undefined
      }


}, [])

const [data1, setData1] = useState([]);
const[bpState, setBpState]=useState()
const[tempState, setTempState]=useState()


useEffect(() => {
  setBpState(bp)
  setTempState(temp)

    // console.log("result from props", result)
    setData1(data)
    const DATA_FREQUENCY_HZ = 300

    const components = chartRef.current
    if (!components) return

    // Set chart data.
    // console.log("data from this state",data1)
    // const { series } = components
    const { chart } = components
    const series = chart.addLineSeries(
            {
    dataPattern: {
        // pattern: 'ProgressiveX' => Each consecutive data point has increased X coordinate.
        pattern: 'ProgressiveX',
        // regularProgressiveStep: true => The X step between each consecutive data point is regular (for example, always `1.0`).
        regularProgressiveStep: true,
    },
    automaticColorIndex: 0
 }
    ).setMaxPointCount()






            // console.log("view data", data)
        // Push more data in each frame, while keeping a consistent amount of incoming points according to specified stream rate as Hz.
        let xPos = 0
        let tPrev = performance.now()
        let newDataModulus = 0
        const streamMoreData = () => {
            const tNow = performance.now()
            const tDelta = tNow - tPrev
            let newDataPointsCount = DATA_FREQUENCY_HZ * (tDelta / 1000) + newDataModulus
            newDataModulus = newDataPointsCount % 1
            newDataPointsCount = Math.floor(newDataPointsCount)
            const seriesNewDataPoints = []
            
                // const nDataset = data1
                // console.log('ndataset', nDataset)

                const newDataPoints = []
                for (let iDp = 0; iDp < newDataPointsCount; iDp++) {
                    const x = xPos + iDp
                    const iData = x % (data1.length - 1)
                    // console.log(iData)
                    const y = data1[iData].y
                    // console.log("x", x, "y", y)
                    // console.log(typeof(y))
                    const point = { x ,y }

                    newDataPoints.push(point)
                }
            
                // console.log("newDataPoints", newDataPoints)
            series.add(newDataPoints)
            xPos += newDataPointsCount
    
            // Request next frame.
            tPrev = tNow
            requestAnimationFrame(streamMoreData)
        }

        // const intervalQ = setInterval( () => {

            streamMoreData();


   
  }, [data,result,bpState,  chartRef])
  return <div  className='chart'>
    <Box>
         <Stack  sx={{marginBottom:"1%", marginLeft:'9%'}} spacing={10} direction='row'>
         <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h6" component="div" >
          classe de l'ECG
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        {result[0]}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom > avec confiance de
        {result[1]}%
        </Typography>
       
        
        </CardContent>
        </Card>

        <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h6" component="div" >
          La tension
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        {bpState}
        </Typography>
       
        
        </CardContent>
        </Card>
        <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h6" component="div" >
         Temperature
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        {tempState}
        </Typography>
     
        
        </CardContent>
        </Card>
  

    {/* type of disease is {result[0]} with confidence of {result[1]}%
    type of disease is {result[0]} with confidence of {result[1]}%
    type of disease is {result[0]} with confidence of {result[1]}% */}


    </Stack>


    </Box>


  </div>
}
export default RealTime