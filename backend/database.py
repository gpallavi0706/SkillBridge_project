"""
SkillBridge - PostgreSQL Database Connection Layer
Supports both Neon Cloud PostgreSQL (via DATABASE_URL) and local PostgreSQL.
"""

import os
from contextlib import contextmanager
from dotenv import load_dotenv
import psycopg2
from psycopg2 import pool, extras

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "5432"))
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "pallavi01")
DB_NAME = os.getenv("DB_NAME", "skillbridge_db")

_pg_pool = None

def init_connection_pool():
    """Initializes the PostgreSQL connection pool."""
    global _pg_pool
    try:
        if DATABASE_URL:
            # Check if running locally and needing hostaddr for DNS resolution
            kwargs = {}
            if "neon.tech" in DATABASE_URL:
                # Add hostaddr if local DNS refuses
                kwargs["hostaddr"] = "3.147.219.177"
            _pg_pool = pool.SimpleConnectionPool(1, 20, dsn=DATABASE_URL, **kwargs)
            print("[Startup] PostgreSQL connection pool initialized from DATABASE_URL (Neon Cloud)")
        else:
            _pg_pool = pool.SimpleConnectionPool(
                1, 20,
                host=DB_HOST,
                port=DB_PORT,
                user=DB_USER,
                password=DB_PASSWORD,
                dbname=DB_NAME
            )
            print(f"[Startup] PostgreSQL connection pool initialized on {DB_HOST}:{DB_PORT}/{DB_NAME}")
    except Exception as e:
        print(f"[PostgreSQL Error] Connection failed: {e}")
        # Fallback to local postgres if DATABASE_URL had an error
        try:
            _pg_pool = pool.SimpleConnectionPool(
                1, 20,
                host=DB_HOST,
                port=DB_PORT,
                user=DB_USER,
                password=DB_PASSWORD,
                dbname=DB_NAME
            )
            print(f"[Startup] Fallback connection to local {DB_HOST}:{DB_PORT}/{DB_NAME} succeeded!")
        except Exception as e2:
            print(f"[PostgreSQL Error] Local fallback failed too: {e2}")
            _pg_pool = None

def get_connection():
    global _pg_pool
    if _pg_pool is None:
        init_connection_pool()
    if _pg_pool is None:
        raise Exception("PostgreSQL connection pool is not initialized.")
    return _pg_pool.getconn()

def release_connection(conn):
    global _pg_pool
    if _pg_pool and conn:
        _pg_pool.putconn(conn)

@contextmanager
def get_db_cursor(commit=False):
    """Context manager yielding a dict cursor, auto-committing or rolling back."""
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    try:
        yield cur
        if commit:
            conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cur.close()
        release_connection(conn)

def check_db_health():
    """Checks PostgreSQL health and returns status for /api/health."""
    try:
        with get_db_cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM students;")
            res = cur.fetchone()
            count = res['count'] if isinstance(res, dict) else res[0]
            cur.execute("SELECT COUNT(*) FROM opportunities;")
            res_opp = cur.fetchone()
            opp_count = res_opp['count'] if isinstance(res_opp, dict) else res_opp[0]
            
            db_label = "Neon Cloud PostgreSQL" if DATABASE_URL and "neon.tech" in DATABASE_URL else "Local PostgreSQL"
            return {
                "status": "healthy",
                "database": db_label,
                "database_name": "neondb" if DATABASE_URL else DB_NAME,
                "host": "Neon AWS US-East-2" if DATABASE_URL else DB_HOST,
                "port": 5432,
                "students_count": count,
                "opportunities_count": opp_count
            }
    except Exception as e:
        return {"status": "database_error", "details": str(e)}
