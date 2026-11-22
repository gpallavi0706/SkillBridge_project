"""
SkillBridge - PostgreSQL Database Connection Layer
Uses psycopg2 with connection pooling for PostgreSQL.
"""

import os
from contextlib import contextmanager
from dotenv import load_dotenv
import psycopg2
from psycopg2 import pool, extras

load_dotenv()

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
        _pg_pool = pool.SimpleConnectionPool(
            1, 20,
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            dbname=DB_NAME
        )
        print(f"[Startup] PostgreSQL connection pool initialized successfully on {DB_HOST}:{DB_PORT}/{DB_NAME}")
    except Exception as e:
        print(f"[PostgreSQL Error] Could not connect to PostgreSQL database '{DB_NAME}' on {DB_HOST}:{DB_PORT}: {e}")
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
            return {
                "status": "healthy",
                "database": "PostgreSQL",
                "database_name": DB_NAME,
                "host": DB_HOST,
                "port": DB_PORT,
                "students_count": count,
                "opportunities_count": opp_count
            }
    except Exception as e:
        return {"status": "database_error", "details": str(e)}
