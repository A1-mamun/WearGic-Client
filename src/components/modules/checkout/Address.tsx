"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cities } from "@/constants/cities";
import {
  updateCity,
  updateShippingAddress,
} from "@/redux/features/cart/cartSlice";
import { useAppDispatch } from "@/redux/hooks";
import React from "react";

export default function Address({
  addressError,
  setAdressError,
  selectedCity,
  selectedShippingAddress,
}: {
  addressError: { city: string; shippingAddress: string };
  setAdressError: React.Dispatch<
    React.SetStateAction<{ city: string; shippingAddress: string }>
  >;
  selectedCity?: string;
  selectedShippingAddress?: string;
}) {
  const dispatch = useAppDispatch();

  const handleCitySelect = (city: string) => {
    dispatch(updateCity(city));
    setAdressError({ ...addressError, city: "" });
  };

  const handleShippingAddress = (address: string) => {
    dispatch(updateShippingAddress(address));
    setAdressError({ ...addressError, shippingAddress: "" });
  };

  return (
    <div className="border-2 border-gray-300 bg-background brightness-105 rounded-md lg:col-span-4  p-5 ">
      <div className="flex flex-col justify-between h-full w-full">
        <h1 className="text-2xl font-bold">Address</h1>
        <p className="text-gray-500">Enter your address.</p>
        <div className="mt-5 w-full">
          <div>
            <Select
              onValueChange={(city) => handleCitySelect(city)}
              value={selectedCity || undefined}
            >
              <SelectTrigger className="mb-1 w-full focus:border-primary">
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* show error message */}
            {addressError.city && (
              <p className="text-red-500 text-sm">{addressError.city}</p>
            )}
          </div>

          <div>
            <Textarea
              value={selectedShippingAddress || undefined}
              onChange={(e) => handleShippingAddress(e.target.value)}
              rows={5}
            />

            {/* show error message */}
            {addressError.shippingAddress && (
              <p className="text-red-500 text-sm mt-1">
                {addressError.shippingAddress}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
