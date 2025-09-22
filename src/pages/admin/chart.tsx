import React from 'react'
import { BarChart, Bar,  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import ClinicAnalyticsReport from './analist'


const data = [
  { doctor: 'Stomatolog Aziz', morning: 5, evening: 7 },
  { doctor: 'Terapevt Ruxshona', morning: 3, evening: 5 },
  { doctor: 'Pediatr Akmal', morning: 6, evening: 9 },
  { doctor: 'Kardiolog Doston', morning: 4, evening: 3 },
  { doctor: 'Nevropatolog Dilshoda', morning: 7, evening: 6 },
  { doctor: 'Endokrinolog Jasur', morning: 5, evening: 4 },
  { doctor: 'Dermatolog Nilufar', morning: 6, evening: 8 },
  { doctor: 'Oftalmolog Sardor', morning: 3, evening: 6 },
  { doctor: 'Otorinolaringolog Shahnoza', morning: 7, evening: 7 },
  { doctor: 'Neonatolog Sitora', morning: 4, evening: 3 },
  { doctor: 'Psixiatrlik Dilshod', morning: 3, evening: 5 },
  { doctor: 'Reabilitolog Aziza', morning: 6, evening: 4 },
  { doctor: 'Traumatolog Bobur', morning: 5, evening: 7 },
]



const Example = () => {
  return (
 
      
     <>
      <div style={{ flex: 1, height: 300 }}>
        <ResponsiveContainer width="100%"  height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="doctor" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="morning" fill="#8884d8" name="Ertalabdan Abetgacha" />
            <Bar dataKey="evening" fill="#82ca9d" name="Abetdan Kechgacha" />
          </BarChart>
        </ResponsiveContainer>
      </div>
<ClinicAnalyticsReport/>
     </>
  )
}


export default Example
