---
name: db-status
description: Check database status, list all tables, and show record counts for PetCard project
---

# Database Status Skill

This skill checks the current state of the PetCard database.

## When to Use
- When user asks about database status
- When user wants to see table counts
- When debugging database issues

## Execution Steps

1. **Locate the database file**
   - Development: `petcard.db` in project root
   - Check if file exists

2. **List all tables**
   ```bash
   sqlite3 petcard.db ".tables"
   ```

3. **Count records in each table**
   ```bash
   sqlite3 petcard.db "SELECT 'users', COUNT(*) FROM users UNION ALL SELECT 'pets', COUNT(*) FROM pets UNION ALL SELECT 'vaccines', COUNT(*) FROM vaccines UNION ALL SELECT 'medical_records', COUNT(*) FROM medical_records;"
   ```

4. **Report findings**
   - Show table names
   - Show record counts
   - Highlight any anomalies (empty tables, missing tables)

## Expected Output Format

```
📊 Database Status Report
========================
Database: petcard.db (exists: ✅)

Tables:
- users: X records
- pets: X records
- vaccines: X records
- medical_records: X records
- clinic_codes: X records
- telegram_notifications: X records

Status: ✅ All tables present
```
