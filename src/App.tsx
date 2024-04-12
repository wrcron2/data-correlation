import React, { useEffect, useReducer, useState } from "react";
import logo from "./logo.svg";
import logoImage from "./haran_logo.jpeg";
import "./App.css";
import { Home } from "./components/Home/Home.tsx";
import App1 from "./services/App1.ts";

export interface Metrics  {
  [key: number]: {
    sovMix: [],
    metric: []
  }
}

interface InitalState {
  apps: {
    [key: number]: Metrics
  },
  selected: string
}


const reducer = (state, action) => {
  switch (action.type) {
    case 'init': 
      return {
        ...state,
        apps: action.payload
      }
    case 'selected': 
      return {
        ...state,
        selected: action.payload
      }
    
  }
}
const initalData: InitalState = {
  apps: {},
  selected: ''
}


const App = () => {
  
  const [state, dispatch] = useReducer(reducer, initalData)

  const { apps, selected } = state

  useEffect(() => {
    let ignore = false;
    App1.convertRawDataCsvToJson().then(arraySI => {
      if (!ignore) {
        App1.convertRawMixDataCsvToJson().then(arrayMix => {
          if (!ignore) {
            const appsKeys = Object.keys(arraySI)
            const orederData = appsKeys.reduce((acc, appKey) => {
              return {
                ...acc,
                [appKey]: {
                  metric: arraySI[appKey],
                  sovMix: arrayMix[appKey]
                }
              }
            }, {} as Metrics)
            console.log(orederData)
            dispatch({ type: 'init', payload: orederData });
          }
        });
      }
    });

  
    
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {

    if (Object.keys(apps).length) {
      dispatch({ type: 'selected', payload: Object.keys(apps)[0] });
    }

  }, [apps])

  const renderLoading = () => {
    return <div>loading...</div>
  }

  const renderMain = () => {
    if (!selected) {
      return <div>loading...</div>

    }
    return (
      <React.Fragment>
        <header className="lw-header">
      <span className="lw-header-title">Spend install correlation </span>
        {/* <img className="logo-image" src={logoImage} /> */}
      </header>
      <div className="lw-content-wrapper">
        <section className="lw-sidenav">
          {Object.keys(apps).map(appId => <a onClick={() => dispatch({ type: 'selected', payload: appId })} key={appId}>{appId}</a>)}
        </section>
        <section className="lw-content">
          <Home key={selected} apps={apps} selected={selected} />
        </section>
      </div>
      </React.Fragment>
    )
  }

  return (
    <div className="layout-wrapper">
        {renderMain()}
    </div>
  );
}

export default App;
