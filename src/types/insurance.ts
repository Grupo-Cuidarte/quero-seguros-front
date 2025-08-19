// Tipos para o sistema de seguros

export interface Insurance {
  id: string;
  type: InsuranceType;
  name: string;
  description: string;
  price: number;
  coverage: Coverage[];
  insuranceCompany: InsuranceCompany;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsuranceCompany {
  id: string;
  name: string;
  logo: string;
  rating: number;
  description: string;
}

export interface Coverage {
  id: string;
  name: string;
  description: string;
  value: number;
  isIncluded: boolean;
}

export interface Quote {
  id: string;
  userId: string;
  insuranceType: InsuranceType;
  personalData: PersonalData;
  vehicleData?: VehicleData;
  propertyData?: PropertyData;
  quotes: Insurance[];
  status: QuoteStatus;
  createdAt: Date;
  expiresAt: Date;
}

export interface PersonalData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: Date;
  age?: number;
  address: Address;
}

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface VehicleData {
  brand: string;
  model: string;
  year: number;
  fuelType: FuelType;
  chassisNumber: string;
  licensePlate: string;
  isFinanced: boolean;
}

export interface PropertyData {
  type: PropertyType;
  size: number;
  constructionYear: number;
  hasAlarm: boolean;
  hasGarage: boolean;
  estimatedValue: number;
}

export enum InsuranceType {
  AUTO = 'auto',
  HEALTH = 'health', 
  DENTAL = 'dental',
  LIFE = 'life'
}

export enum QuoteStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  EXPIRED = 'expired'
}

export enum FuelType {
  GASOLINE = 'gasoline',
  ETHANOL = 'ethanol',
  FLEX = 'flex',
  DIESEL = 'diesel',
  ELECTRIC = 'electric',
  HYBRID = 'hybrid'
}

export enum PropertyType {
  HOUSE = 'house',
  APARTMENT = 'apartment',
  CONDO = 'condo'
}
