from pydantic import BaseModel, Field


class TodoItemBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    completed: bool = False


class TodoItemCreate(TodoItemBase):
    pass


class TodoItemUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    completed: bool | None = None


class TodoItemRead(TodoItemBase):
    id: int

    class Config:
        from_attributes = True
