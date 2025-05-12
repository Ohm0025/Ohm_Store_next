"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DashboardContentProps {
  data: Array<{
    date: string;
    revenue: number;
    cost: number;
    profit: number;
  }>;
}

const DashboardContent = ({ data }: DashboardContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly sale for 1 month</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer>
            <BarChart data={data}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Legend />
              <Tooltip />
              <Bar
                dataKey="revenue"
                fill="#4F46E5"
                name="Revenue"
                barSize={15}
              />
              <Bar dataKey="cost" fill="#E53E3E" name="Cost" barSize={15} />
              <Bar dataKey="profit" fill="#22C55E" name="Profit" barSize={15} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardContent;
