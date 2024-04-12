import React, { PureComponent, useEffect, useState, useReducer } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import "./style.css";
import Button from "../Button/Button.tsx";
import { Overview } from "../Overview/Overview.tsx";
import App1 from "../../services/App1.ts";
import { Metrics } from "../../App.tsx";
const dataSOV = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];


const metricISname = "metric"
const metricSOVname = "sovMix"


interface HomeProps {
  apps: Metrics,
  selected: string
}

export const Home:React.FC<HomeProps> = ({ apps, selected }) => {

  // const [metricsData, dispatch] = useReducer(dataReducer, initialData)
  const [data, setAppData] = useState([]);
  const [selectedMetricName, setSelectedMetricName] = useState(metricISname)

  useEffect(() => {
    setSelectedMetricName(metricISname)
    setAppData(apps[selected][selectedMetricName])
  }, [apps, selected])

  const onMetriclick = (e:React.MouseEvent<HTMLElement>, val: string) => {
    setSelectedMetricName(metricISname)
    setAppData(apps[selected][val])
  }

  const onMetricMixClick = (e: React.MouseEvent<HTMLElement>, val: string) => {
    setSelectedMetricName(metricSOVname)
    setAppData(apps[selected][val])
  }

  const renderLoading = () => {
    return <div>Loadding...</div>
  }



  const renderSelectedGraph = () => {
    if (selectedMetricName === metricISname) {
      return (
        <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="spend"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="installs"  stroke="#2D669D" />
        {/* <Line type="monotone" dataKey="impressions" stroke="#023E8A" />
        <Line type="monotone" dataKey="clicks"  stroke="#A4D2FF" /> */}
  


        ['spend', 'installs', 'impressions', 'clicks', 'ad_revenue_d0']
      </LineChart>
      )
      
    } else {
      if (selectedMetricName === metricSOVname) {
        return (
          <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
            <YAxis />
          <Tooltip />
          <Legend />
          <Bar  dataKey="Unity" stackId="a" fill="#8884d8" />
          <Bar  dataKey="Organic" stackId="a" fill="#82ca9d" />
            <Bar  dataKey="Mintegral" stackId="a" fill="#ffc658" />
            <Bar  dataKey="IronSource" stackId="a" fill="#664C43" />
          <Bar  dataKey="Google Ads" stackId="a" fill="#873D48" />
            <Bar  dataKey="Cross Promotion" stackId="a" fill="#DC758F" />
            <Bar  dataKey="Apple Search Ads" stackId="a" fill="#00FFCD" />
        </BarChart>
        )
      }
    }

    return <span>Error</span>
  }

  const retnderMain = () => {

    return (
      <React.Fragment>
         <Overview selected={ selected } />
      <div className="metrics-section">
        <hr className="hr-horizantal"></hr>
        <div className="metrics-container">
            <Button className={selectedMetricName === metricSOVname ? 'selected' : '' } onClick={(e) => onMetricMixClick(e, metricSOVname)} text={"install sources mix"} />
          <Button className={selectedMetricName === metricISname ? 'selected' : '' } onClick={(e) => onMetriclick(e, metricISname)} text={"Spend/installs"} />
        </div>
      </div>
      <hr className="hr-horizantal"></hr>
        <div className="graph-section">
          <ResponsiveContainer width="100%" height="100%">
            {renderSelectedGraph()}
      
        </ResponsiveContainer>
      </div>
      </React.Fragment>
    )

  }

  return (
    
    <div className="home">
      {!Object.keys(apps).length ? renderLoading() : retnderMain()}
    </div>
  );
};


