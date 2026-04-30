from __future__ import annotations

import sqlite3
import uuid
from pathlib import Path


def _table_columns(cursor: sqlite3.Cursor, table: str) -> dict[str, tuple]:
    cursor.execute(f"PRAGMA table_info({table})")
    rows = cursor.fetchall()
    return {row[1]: row for row in rows}


def migrate_legacy_users_table(database_path: Path) -> None:
    """
    Upgrade legacy `users` schema to the current auth schema in-place.

    Legacy schema seen in this project:
      users(id INTEGER PK, email, password_hash, created_at)

    Current schema expected by ORM/routes:
      users(id TEXT PK, email UNIQUE, hashed_password, role, created_at)
    """
    db_file = Path(database_path)
    if not db_file.exists():
        return

    connection = sqlite3.connect(str(db_file))
    try:
        cursor = connection.cursor()
        columns = _table_columns(cursor, "users")
        if not columns:
            return

        id_type = str(columns.get("id", (None, None, ""))[2]).upper()
        has_legacy_password = "password_hash" in columns
        missing_new_columns = "hashed_password" not in columns or "role" not in columns

        if not (has_legacy_password or missing_new_columns or id_type == "INTEGER"):
            return

        cursor.execute("PRAGMA foreign_keys=OFF")
        cursor.execute("ALTER TABLE users RENAME TO users_legacy")
        cursor.execute(
            """
            CREATE TABLE users (
                id TEXT PRIMARY KEY NOT NULL,
                email VARCHAR NOT NULL UNIQUE,
                hashed_password VARCHAR NOT NULL,
                role VARCHAR DEFAULT 'user',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email ON users (email)")

        legacy_cols = _table_columns(cursor, "users_legacy")
        legacy_password_col = (
            "hashed_password" if "hashed_password" in legacy_cols else "password_hash"
        )
        legacy_role_col = "role" if "role" in legacy_cols else None
        legacy_created_col = "created_at" if "created_at" in legacy_cols else None

        cursor.execute("SELECT * FROM users_legacy")
        legacy_rows = cursor.fetchall()
        legacy_names = [desc[0] for desc in cursor.description]

        for row in legacy_rows:
            row_data = dict(zip(legacy_names, row))
            user_id = row_data.get("id")
            normalized_id = str(user_id) if user_id is not None else str(uuid.uuid4())
            email = row_data.get("email")
            hashed_password = row_data.get(legacy_password_col) or ""
            role = row_data.get(legacy_role_col) if legacy_role_col else "user"
            created_at = row_data.get(legacy_created_col) if legacy_created_col else None

            if not email or not hashed_password:
                continue

            cursor.execute(
                """
                INSERT OR IGNORE INTO users (id, email, hashed_password, role, created_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (normalized_id, email, hashed_password, role or "user", created_at),
            )

        # Keep related FK-ish references compatible with string IDs.
        if _table_columns(cursor, "user_profiles"):
            cursor.execute("UPDATE user_profiles SET user_id = CAST(user_id AS TEXT)")
        if _table_columns(cursor, "trial_interactions"):
            cursor.execute("UPDATE trial_interactions SET user_id = CAST(user_id AS TEXT)")

        cursor.execute("DROP TABLE users_legacy")
        connection.commit()
    finally:
        connection.close()
