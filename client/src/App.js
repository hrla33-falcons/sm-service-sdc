import React, { useState, useEffect } from 'react'
import Section from './components/Section'
import sections from './data/sections'
import axios from 'axios'
import rightArrow from './images/right-arrow.svg'
import './App.scss'

function App() {
  const [data, setData] = useState()

  useEffect(() => {
    axios
      .get('/reviews/')
      .then(response => {
        const data = response.data
        const averages = {
          valueForMoney: 0,
          productQuality: 0,
          appearance: 0,
          ease: 0,
          worksAsExpected: 0,
          overall: 0
        }
        const reviews = data.reviews
        for (let i = 0; i < reviews.length; i++) {
          averages.overall += reviews[i].stars
          averages.valueForMoney += reviews[i].valueForMoney
          averages.productQuality += reviews[i].productQuality
          averages.appearance += reviews[i].appearance
          averages.ease += reviews[i].ease
          averages.worksAsExpected += reviews[i].worksAsExpected
        }

        for (const key in averages) {
          averages[key] = averages[key] / reviews.length
        }

        data.averages = averages

        setData(data)
      })
      .catch(err => console.error(err))
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        fontFamily: `'Noto IKEA', 'Noto Sans', 'Roboto', 'Open Sans', sans-serif`,
        marginTop: 100,
        marginBottom: 36,
        lineHeight: 1.5
      }}
    >
      <div style={{ maxWidth: 1200, flexGrow: 1 }}>
        {data &&
          sections.map((section, i) => (
            <Section {...section} key={`section-${i}`} data={data} />
          ))}
        <hr
          style={{
            margin: '0',
            borderTop: '1px solid #ccc',
            borderBottom: '0'
          }}
        />
        {data && (
          <div
            style={{
              margin: 16
            }}
          >
            <MoreButton name={data.product.name} />
          </div>
        )}
        <div style={{ borderBottom: '1px solid #ccc', marginBottom: 48 }} />
      </div>
    </div>
  )
}

function MoreButton({ name }) {
  return (
    <button
      className="bm-app-2"
      style={{
        width: 'auto',
        padding: '10px 24px 10px 24px',
        margin: 'auto'
      }}
    >
      More in the {name.toUpperCase()} collection{' '}
      <img className="bm-app-1" src={rightArrow} />
    </button>
  )
}

export default App
