import { Box, Grid, Paper, Typography } from '@mui/material'
import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

const mockData = [
  { date: '2023-09-01', patients: 5, revenue: 1000, expenses: 300 },
  { date: '2023-09-02', patients: 8, revenue: 1200, expenses: 400 },
  { date: '2023-09-03', patients: 6, revenue: 900, expenses: 200 },
  { date: '2023-09-04', patients: 7, revenue: 1100, expenses: 350 },
  { date: '2023-09-05', patients: 10, revenue: 1500, expenses: 500 },
  { date: '2023-09-06', patients: 9, revenue: 1300, expenses: 450 },
  { date: '2023-09-07', patients: 12, revenue: 1700, expenses: 600 },
]

export default function Dashboard() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={4}>
        {/* Patients over time */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>
              Patients Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="patients" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Revenue and Expenses */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>
              Revenue vs Expenses
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#82ca9d" />
                <Bar dataKey="expenses" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
