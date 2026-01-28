from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, Date, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True) # Optional in MVP Phase 1
    email = Column(String, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    username = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    pets = relationship("Pet", back_populates="owner", cascade="all, delete-orphan")
    notifications = relationship("TelegramNotification", back_populates="user", cascade="all, delete-orphan")

class Pet(Base):
    __tablename__ = "pets"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String, nullable=False)
    species = Column(String, nullable=False) # Dog, Cat, etc.
    breed = Column(String, nullable=True)
    dob = Column(Date, nullable=True)
    weight = Column(Float, nullable=True)
    microchip_id = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship("User", back_populates="pets")
    vaccines = relationship("Vaccine", back_populates="pet", cascade="all, delete-orphan")
    medical_records = relationship("MedicalRecord", back_populates="pet", cascade="all, delete-orphan")
    # One-to-one or Many-to-one for ClinicCode? 
    # Prompt: Pet (1) -> (one) ClinicCode
    clinic_code = relationship("ClinicCode", uselist=False, back_populates="pet", cascade="all, delete-orphan")

class Vaccine(Base):
    __tablename__ = "vaccines"

    id = Column(Integer, primary_key=True, index=True)
    pet_id = Column(Integer, ForeignKey("pets.id", ondelete="CASCADE"), nullable=False, index=True)
    vaccine_name = Column(String, nullable=False)
    date_administered = Column(Date, nullable=False)
    next_due_date = Column(Date, nullable=True)
    clinic_name = Column(String, nullable=True) # For manual entry
    vet_name = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    status = Column(String, default="active") # active, expired, overdue
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    pet = relationship("Pet", back_populates="vaccines")

class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id = Column(Integer, primary_key=True, index=True)
    pet_id = Column(Integer, ForeignKey("pets.id", ondelete="CASCADE"), nullable=False, index=True)
    record_type = Column(String, nullable=False) # Visit, Lab, Prescription, Surgery
    record_date = Column(Date, nullable=False)
    clinic_name = Column(String, nullable=True)
    vet_name = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    attachments = Column(String, nullable=True) # JSON or comma-separated URLs? String for now (single URL) or Text. Let's use Text/String.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    pet = relationship("Pet", back_populates="medical_records")

class ClinicCode(Base):
    __tablename__ = "clinic_codes"

    id = Column(Integer, primary_key=True, index=True)
    pet_id = Column(Integer, ForeignKey("pets.id", ondelete="CASCADE"), unique=True, nullable=False) # 1-to-1 with Pet for now based on Prompt "Pet (1) -> (one) ClinicCode"
    # Actually prompt says: users->connected clinics (many to many) in PROJECT_FOUNDATION, but in USER_REQUEST it says:
    # "ClinicCode — Manual clinic connection (id, pet_id, code, clinic_name, clinic_phone, created_at)"
    # "Pet (1) -> (one) ClinicCode"
    # So we follow the USER_REQUEST specific responsibilities.
    
    code = Column(String, unique=True, index=True, nullable=False)
    clinic_name = Column(String, nullable=True) # Fetched from code lookup or stored
    clinic_phone = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    pet = relationship("Pet", back_populates="clinic_code")

class TelegramNotification(Base):
    __tablename__ = "telegram_notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String, nullable=False) # reminder, alert, info
    read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="notifications")
