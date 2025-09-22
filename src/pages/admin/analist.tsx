import React from 'react'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Box,  Paper } from '@mui/material'

const data = [
  { name: 'Jun', patients: 45, visits: 120, amt: 2400 },
  { name: 'Jul', patients: 50, visits: 135, amt: 2210 },
  { name: 'Aug', patients: 55, visits: 160, amt: 2290 },
  { name: 'Sep', patients: 60, visits: 180, amt: 2000 },
  { name: 'Oct', patients: 65, visits: 190, amt: 2181 },
  { name: 'Nov', patients: 70, visits: 210, amt: 2500 },
  { name: 'Dec', patients: 75, visits: 230, amt: 2100 },
]

export default function ClinicAnalyticsReport() {
  return (
    <Paper sx={{ padding: 3,  gap: 5, alignItems: 'center', maxWidth: 750 }}>

      <Box sx={{ width: 500, height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" height={36}/>
            <Line type="monotone" dataKey="patients" stroke="#1976d2" strokeWidth={3} name="Bemorlar soni" />
            <Line type="monotone" dataKey="visits" stroke="#f4a261" strokeWidth={3} name="Tashriflar soni" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
