"""
SkillBridge - Apply Multi-Role Database Migration
Applies tables: accounts, recruiter_profiles, organization status, and pre-seeded users (Ram Balaji, Priya Sharma, etc.)
"""

import os
import sys
from database import init_connection_pool, get_db_cursor

def run_migration():
    print("[Migration] Connecting to MySQL...")
    connected = init_connection_pool()
    if not connected:
        print("[Migration Warning] Could not connect to MySQL server. Please ensure MySQL is running.")
        return False

    migration_file = os.path.join(os.path.dirname(__file__), "multi_role_migration.sql")
    if not os.path.exists(migration_file):
        print(f"[Migration Error] Migration file not found: {migration_file}")
        return False

    with open(migration_file, "r", encoding="utf-8") as f:
        sql_content = f.read()

    # Split into individual SQL statements
    statements = [stmt.strip() for stmt in sql_content.split(";") if stmt.strip()]

    applied = 0
    with get_db_cursor() as cursor:
        for stmt in statements:
            # Skip USE statement
            if stmt.upper().startswith("USE "):
                continue
            try:
                cursor.execute(stmt)
                applied += 1
            except Exception as e:
                # Ignore already exists or harmless duplicate errors
                print(f"[Statement Warning] {str(e)} on statement: {stmt[:60]}...")

    print(f"[Migration Complete] Successfully executed {applied} SQL statements!")
    return True

if __name__ == "__main__":
    run_migration()
