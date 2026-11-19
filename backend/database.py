"""
SkillBridge - MySQL Database Connection Layer
Uses mysql-connector-python with connection pooling for high reliability and performance.
"""

import os
from contextlib import contextmanager
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import pooling, Error

# Load environment variables from .env
load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "root")
DB_NAME = os.getenv("DB_NAME", "skillbridge_db")

connection_pool = None

def init_connection_pool():
    """Initializes the MySQL connection pool, trying the configured port and falling back between 3307 and 3306."""
    global connection_pool, DB_PORT
    ports_to_try = [DB_PORT]
    if DB_PORT == 3307:
        ports_to_try.append(3306)
    elif DB_PORT == 3306:
        ports_to_try.append(3307)

    for port in ports_to_try:
        try:
            connection_pool = pooling.MySQLConnectionPool(
                pool_name="skillbridge_pool",
                pool_size=5,
                pool_reset_session=True,
                host=DB_HOST,
                port=port,
                user=DB_USER,
                password=DB_PASSWORD,
                database=DB_NAME,
                charset="utf8mb4",
                collation="utf8mb4_unicode_ci"
            )
            DB_PORT = port
            print(f"[MySQL] Successfully connected to database '{DB_NAME}' on {DB_HOST}:{port}")
            return True
        except Error:
            continue

    print(f"[MySQL Error] Could not connect to MySQL database '{DB_NAME}' on ports {ports_to_try} with user '{DB_USER}'")
    print("[MySQL Help] Make sure MySQL Server is running (run run_clean_mysql.bat or check your Windows MySQL service).")
    return False

@contextmanager
def get_db_connection():
    """Context manager for obtaining a connection from the pool or a fresh connection."""
    global connection_pool
    conn = None
    try:
        if connection_pool is None:
            init_connection_pool()
        
        if connection_pool:
            conn = connection_pool.get_connection()
        else:
            # Fallback direct connection
            conn = mysql.connector.connect(
                host=DB_HOST,
                port=DB_PORT,
                user=DB_USER,
                password=DB_PASSWORD,
                database=DB_NAME,
                charset="utf8mb4",
                collation="utf8mb4_unicode_ci"
            )
        yield conn
    except Error as err:
        print(f"[Database Error]: {err}")
        raise err
    finally:
        if conn and conn.is_connected():
            conn.close()

@contextmanager
def get_db_cursor(commit=False):
    """Context manager yielding a dictionary cursor with optional auto-commit."""
    with get_db_connection() as conn:
        cursor = conn.cursor(dictionary=True)
        try:
            yield cursor
            if commit:
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cursor.close()

def check_db_health():
    """Checks whether the database connection is healthy and returns statistics."""
    try:
        with get_db_cursor() as cursor:
            cursor.execute("SELECT 1 AS healthy;")
            res = cursor.fetchone()
            
            cursor.execute("SELECT COUNT(*) AS total_opps FROM opportunities;")
            opps_count = cursor.fetchone().get("total_opps", 0)
            
            cursor.execute("SELECT COUNT(*) AS total_users FROM users;")
            users_count = cursor.fetchone().get("total_users", 0)

            return {
                "status": "connected",
                "database": DB_NAME,
                "host": DB_HOST,
                "port": DB_PORT,
                "opportunities_count": opps_count,
                "users_count": users_count
            }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "database": DB_NAME,
            "host": DB_HOST,
            "port": DB_PORT,
            "tip": "Ensure MySQL Server is started and schema.sql has been executed in MySQL Workbench."
        }
