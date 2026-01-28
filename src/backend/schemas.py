from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

# User Schemas
class UserBase(BaseModel):
    telegram_id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None
    photo_url: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Pet Schemas
class PetBase(BaseModel):
    name: str
    species: str
    breed: Optional[str] = None
    dob: Optional[date] = None
    weight: Optional[float] = None # weight_kg -> weight (float)
    photo_url: Optional[str] = None
    microchip_id: Optional[str] = None # chip_number -> microchip_id

class PetCreate(PetBase):
    pass

class PetUpdate(BaseModel):
    name: Optional[str] = None
    species: Optional[str] = None
    breed: Optional[str] = None
    dob: Optional[date] = None
    weight: Optional[float] = None
    photo_url: Optional[str] = None
    microchip_id: Optional[str] = None

class PetResponse(PetBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

# Vaccine Schemas
class VaccineBase(BaseModel):
    vaccine_name: str # name -> vaccine_name
    date_administered: date
    next_due_date: Optional[date] = None
    notes: Optional[str] = None
    status: Optional[str] = "active"

class VaccineCreate(VaccineBase):
    pass

class VaccineUpdate(BaseModel):
    vaccine_name: Optional[str] = None
    date_administered: Optional[date] = None
    next_due_date: Optional[date] = None
    notes: Optional[str] = None
    status: Optional[str] = None

class VaccineResponse(VaccineBase):
    id: int
    pet_id: int

    class Config:
        from_attributes = True

# Medical Record Schemas
class MedicalRecordBase(BaseModel):
    record_date: date # date -> record_date
    record_type: str
    notes: Optional[str] = None
    vet_name: Optional[str] = None
    clinic_name: Optional[str] = None
    attachments: Optional[str] = None # attachment_url -> attachments

class MedicalRecordCreate(MedicalRecordBase):
    pass

class MedicalRecordResponse(MedicalRecordBase):
    id: int
    pet_id: int

    class Config:
        from_attributes = True

# Clinic Code Schema
class ClinicValidateRequest(BaseModel):
    code: str
    pet_id: int

class ClinicResponse(BaseModel):
    id: int
    clinic_name: Optional[str] = None
    clinic_phone: Optional[str] = None

    class Config:
        from_attributes = True
