from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, database, auth

router = APIRouter(
    prefix="/pets",
    tags=["pets"]
)

# helper to check ownership
def check_pet_ownership(pet_id: int, user: models.User, db: Session):
    pet = db.query(models.Pet).filter(models.Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    if pet.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this pet")
    return pet

# --- PETS ---

@router.post("/", response_model=schemas.PetResponse)
def create_pet(pet: schemas.PetCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    new_pet = models.Pet(
        owner_id=current_user.id,
        **pet.model_dump()
    )
    db.add(new_pet)
    db.commit()
    db.refresh(new_pet)
    return new_pet

@router.get("/", response_model=List[schemas.PetResponse])
def read_pets(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    return db.query(models.Pet).filter(models.Pet.owner_id == current_user.id).all()

@router.get("/{pet_id}", response_model=schemas.PetResponse)
def read_pet(pet_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    return check_pet_ownership(pet_id, current_user, db)

@router.put("/{pet_id}", response_model=schemas.PetResponse)
def update_pet(pet_id: int, pet_update: schemas.PetUpdate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    pet = check_pet_ownership(pet_id, current_user, db)
    
    update_data = pet_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(pet, key, value)
    
    db.commit()
    db.refresh(pet)
    return pet

@router.delete("/{pet_id}")
def delete_pet(pet_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    pet = check_pet_ownership(pet_id, current_user, db)
    db.delete(pet)
    db.commit()
    return {"message": "Pet deleted"}

# --- VACCINES ---

@router.post("/{pet_id}/vaccines", response_model=schemas.VaccineResponse)
def create_vaccine(pet_id: int, vaccine: schemas.VaccineCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    check_pet_ownership(pet_id, current_user, db)
    new_vaccine = models.Vaccine(
        pet_id=pet_id,
        **vaccine.model_dump()
    )
    db.add(new_vaccine)
    db.commit()
    db.refresh(new_vaccine)
    return new_vaccine

@router.get("/{pet_id}/vaccines", response_model=List[schemas.VaccineResponse])
def read_vaccines(pet_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    check_pet_ownership(pet_id, current_user, db)
    return db.query(models.Vaccine).filter(models.Vaccine.pet_id == pet_id).all()

@router.put("/{pet_id}/vaccines/{vaccine_id}", response_model=schemas.VaccineResponse)
def update_vaccine(pet_id: int, vaccine_id: int, vaccine_update: schemas.VaccineUpdate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    check_pet_ownership(pet_id, current_user, db)
    vaccine = db.query(models.Vaccine).filter(models.Vaccine.id == vaccine_id, models.Vaccine.pet_id == pet_id).first()
    if not vaccine:
        raise HTTPException(status_code=404, detail="Vaccine not found")
    
    update_data = vaccine_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(vaccine, key, value)
    
    db.commit()
    db.refresh(vaccine)
    return vaccine

@router.delete("/{pet_id}/vaccines/{vaccine_id}")
def delete_vaccine(pet_id: int, vaccine_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    check_pet_ownership(pet_id, current_user, db)
    vaccine = db.query(models.Vaccine).filter(models.Vaccine.id == vaccine_id, models.Vaccine.pet_id == pet_id).first()
    if not vaccine:
        raise HTTPException(status_code=404, detail="Vaccine not found")
    db.delete(vaccine)
    db.commit()
    return {"message": "Vaccine deleted"}

# --- MEDICAL RECORDS ---

@router.post("/{pet_id}/records", response_model=schemas.MedicalRecordResponse)
def create_medical_record(pet_id: int, record: schemas.MedicalRecordCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    check_pet_ownership(pet_id, current_user, db)
    new_record = models.MedicalRecord(
        pet_id=pet_id,
        **record.model_dump()
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

@router.get("/{pet_id}/records", response_model=List[schemas.MedicalRecordResponse])
def read_medical_records(pet_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    check_pet_ownership(pet_id, current_user, db)
    return db.query(models.MedicalRecord).filter(models.MedicalRecord.pet_id == pet_id).all()

@router.delete("/{pet_id}/records/{record_id}")
def delete_medical_record(pet_id: int, record_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    check_pet_ownership(pet_id, current_user, db)
    record = db.query(models.MedicalRecord).filter(models.MedicalRecord.id == record_id, models.MedicalRecord.pet_id == pet_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(record)
    db.commit()
    return {"message": "Record deleted"}

# --- CLINIC INFO ---
@router.get("/{pet_id}/clinic", response_model=schemas.ClinicResponse)
def get_pet_clinic(pet_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    pet = check_pet_ownership(pet_id, current_user, db)
    if not pet.clinic_code:
        # Changed from pet.clinic to pet.clinic_code based on models.py
        raise HTTPException(status_code=404, detail="No clinic connected to this pet")
    return pet.clinic_code
