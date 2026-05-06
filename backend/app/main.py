from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from . import models
from .database import Base, engine
from .routes import clinics as clinics_router
from .routes import trials as trials_router
from .routes import users as users_router

Base.metadata.create_all(bind=engine)


def _ensure_sqlite_columns() -> None:
    def default_sql(column) -> str:
        default = column.default
        if default is None or not getattr(default, "is_scalar", False):
            return ""

        value = default.arg
        if isinstance(value, bool):
            return f" DEFAULT {1 if value else 0}"
        if isinstance(value, (int, float)):
            return f" DEFAULT {value}"
        if isinstance(value, str):
            safe = value.replace("'", "''")
            return f" DEFAULT '{safe}'"
        return ""

    def ensure_table_columns(table) -> None:
        with engine.begin() as conn:
            existing = {
                row[1]
                for row in conn.execute(
                    text(f"PRAGMA table_info('{table.name}')")
                ).fetchall()
            }

            for column in table.columns:
                if column.name in existing:
                    continue

                sql_type = column.type.compile(dialect=engine.dialect)
                conn.execute(
                    text(
                        f"ALTER TABLE {table.name} ADD COLUMN {column.name} {sql_type}{default_sql(column)}"
                    )
                )

    ensure_table_columns(models.User.__table__)
    ensure_table_columns(models.UserProfile.__table__)
    ensure_table_columns(models.ClinicProfile.__table__)
    ensure_table_columns(models.Trial.__table__)
    ensure_table_columns(models.TrialInteraction.__table__)


_ensure_sqlite_columns()

app = FastAPI(title="Class Project API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(trials_router.router)
app.include_router(users_router.router)
app.include_router(clinics_router.router)
