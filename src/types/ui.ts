import React from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface InputProps {
  label: React.ReactNode;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  disabled?: boolean;
  placeholder?: string;
}

export interface SelectProps {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: SelectOption[];
}

export interface ListInputProps {
  label: React.ReactNode;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  disabled?: boolean;
  helpText?: string;
}

export interface ListSelectProps {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: SelectOption[];
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  flatOnMobile?: boolean;
}
