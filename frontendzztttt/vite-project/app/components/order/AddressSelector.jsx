// AddressSelector.js
"use client";

import React, { useEffect, useState } from "react";
import subVn from "sub-vn";
import { Controller } from "react-hook-form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const AddressSelector = ({ control, name, errors }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (value) => {
          if (!value?.city || !value?.district || !value?.ward) {
            return "Vui lòng chọn thành phố,quận,huyện";
          }
          return true;
        },
      }}
      render={({ field: { onChange, value = {} } }) => {
        const [city, setCity] = useState(value.city || "");
        const [district, setDistrict] = useState(value.district || "");
        const [ward, setWard] = useState(value.ward || "");

        const [cityOpen, setCityOpen] = useState(false);
        const [districtOpen, setDistrictOpen] = useState(false);
        const [wardOpen, setWardOpen] = useState(false);

        const cities = subVn.getProvinces();
        const districts = city ? subVn.getDistrictsByProvinceCode(city) : [];
        const wards = district ? subVn.getWardsByDistrictCode(district) : [];

        useEffect(() => {
          setCity(value.city || "");
          setDistrict(value.district || "");
          setWard(value.ward || "");
        }, [value]);

        const handleCityChange = (newCityCode) => {
          setCity(newCityCode);
          setDistrict("");
          setWard("");
          onChange({ city: newCityCode, district: "", ward: "" });
        };

        const handleDistrictChange = (newDistrictCode) => {
          setDistrict(newDistrictCode);
          setWard("");
          onChange({ ...value, district: newDistrictCode, ward: "" });
        };

        const handleWardChange = (newWardCode) => {
          setWard(newWardCode);
          onChange({ ...value, ward: newWardCode });
        };

        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* --- Tỉnh / Thành phố --- */}
            <Popover open={cityOpen} onOpenChange={setCityOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between ",
                    !city && "text-muted-foreground"
                  )}
                >
                  {city
                    ? cities.find((c) => c.code === city)?.name
                    : "Chọn Tỉnh / Thành phố"}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[250px] max-h-[300px] z-[100]">
                <Command>
                  <CommandInput placeholder="Tìm kiếm tỉnh/thành phố..." />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy tỉnh nào.</CommandEmpty>
                    <CommandGroup>
                      {cities.map((c) => (
                        <CommandItem
                          key={c.code}
                          value={`${c.name} ${c.code}`}
                          onSelect={() => {
                            handleCityChange(c.code);
                            setCityOpen(false);
                            setTimeout(() => {
                              setDistrictOpen(true);
                            }, 100);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              city === c.code ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {c.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* --- Quận / Huyện --- */}
            <Popover open={districtOpen} onOpenChange={setDistrictOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between",
                    !district && "text-muted-foreground"
                  )}
                  disabled={!city}
                >
                  {district
                    ? districts.find((d) => d.code === district)?.name
                    : "Chọn Quận / Huyện"}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[250px] max-h-[300px]">
                <Command>
                  <CommandInput placeholder="Tìm kiếm quận/huyện..." />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy huyện nào.</CommandEmpty>
                    <CommandGroup>
                      {districts.map((d) => (
                        <CommandItem
                          key={d.code}
                          value={`${d.name} ${d.code}`}
                          onSelect={() => {
                            handleDistrictChange(d.code);
                            setDistrictOpen(false);
                            setTimeout(() => {
                              setWardOpen(true);
                            }, 100);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              district === d.code ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {d.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* --- Phường / Xã --- */}
            <Popover open={wardOpen} onOpenChange={setWardOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between",
                    !ward && "text-muted-foreground"
                  )}
                  disabled={!district}
                >
                  {ward
                    ? wards.find((w) => w.code === ward)?.name
                    : "Chọn Phường / Xã"}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[250px] max-h-[300px]">
                <Command>
                  <CommandInput placeholder="Tìm kiếm phường/xã..." />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy xã nào.</CommandEmpty>
                    <CommandGroup>
                      {wards.map((w) => (
                        <CommandItem
                          key={w.code}
                          value={`${w.name} ${w.code}`}
                          onSelect={() => {
                            handleWardChange(w.code);
                            setWardOpen(false);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              ward === w.code ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {w.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        );
      }}
    />
  );
};

export default AddressSelector;
