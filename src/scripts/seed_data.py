import sys
import os
sys.path.append(os.path.join(os.getcwd(), "src"))

from backend.database import SessionLocal
from backend.models import User, Pet, Vaccine, MedicalRecord, ClinicCode
from datetime import date, timedelta

def seed():
    print("Seeding data...")
    db = SessionLocal()
    try:
        # Check if user exists
        if db.query(User).filter(User.telegram_id == "123456789").first():
            print("Data already seeded.")
            return

        # Create User
        user = User(
            telegram_id="123456789",
            phone="+1234567890",
            username="testuser",
            first_name="Test",
            last_name="User",
            photo_url="https://example.com/photo.jpg"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"Created User: {user.id}")

        # Create Pet
        pet = Pet(
            owner_id=user.id,
            name="Bella",
            species="Dog",
            breed="Labrador",
            dob=date.today() - timedelta(days=365*3),
            weight=25.0
        )
        db.add(pet)
        db.commit()
        db.refresh(pet)
        print(f"Created Pet: {pet.id}")

        # Create Vaccine
        vax = Vaccine(
            pet_id=pet.id,
            vaccine_name="Rabies",
            date_administered=date.today() - timedelta(days=30),
            next_due_date=date.today() + timedelta(days=335),
            status="active"
        )
        db.add(vax)
        print("Created Vaccine")

        # Create Medical Record
        record = MedicalRecord(
            pet_id=pet.id,
            record_type="Visit",
            record_date=date.today() - timedelta(days=30),
            clinic_name="Happy Paws Clinic",
            vet_name="Dr. Smith",
            notes="Annual checkup. All good."
        )
        db.add(record)
        print("Created Medical Record")

        # Create Clinic Code
        code = ClinicCode(
            pet_id=pet.id,
            code="VET-ABC123",
            clinic_name="Manual Clinic Entry"
        )
        db.add(code)
        print("Created Clinic Code")
        
        db.commit()
        print("Seeding complete.")
    except Exception as e:
        print(f"Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
