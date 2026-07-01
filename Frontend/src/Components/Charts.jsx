import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts';

export const SalesAreaChart = ({ data = [] }) => {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            stroke="#7E736D" 
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#7E736D" 
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #E5D3B3', 
              borderRadius: '16px',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
              fontSize: '11px',
              fontFamily: 'Poppins'
            }} 
          />
          <Area 
            type="monotone" 
            dataKey="sales" 
            stroke="#D4AF37" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorSales)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CategoryPieChart = ({ data = [] }) => {
  const COLORS = ['#D4AF37', '#FADCD9', '#E5D3B3', '#C5A880', '#AA7C11'];

  return (
    <div className="w-full h-80 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E5D3B3',
              borderRadius: '12px',
              fontSize: '11px',
              fontFamily: 'Poppins'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconSize={8}
            iconType="circle"
            wrapperStyle={{ fontSize: '10px', fontFamily: 'Poppins' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const AttendeesBarChart = ({ data = [] }) => {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="name" 
            stroke="#7E736D" 
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#7E736D" 
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #E5D3B3', 
              borderRadius: '12px',
              fontSize: '11px',
              fontFamily: 'Poppins'
            }}
          />
          <Bar dataKey="checkedIn" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Checked In" />
          <Bar dataKey="total" fill="#E5D3B3" radius={[4, 4, 0, 0]} name="Total Tickets" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
