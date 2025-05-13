"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";

interface DateRangePickerProps {
  start: string;
  end: string;
}

const DateRangePicker = ({ start, end }: DateRangePickerProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleDateChange = (type: "start" | "end", value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(type, value);
    router.push(`/admin?${newParams.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div>
          <Label>Start</Label>
          <Input
            type="date"
            defaultValue={start}
            max={end}
            onChange={(e) => handleDateChange("start", e.target.value)}></Input>
        </div>
        <div>
          <Label>End</Label>
          <Input
            type="date"
            defaultValue={end}
            min={start}
            onChange={(e) => handleDateChange("end", e.target.value)}></Input>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
