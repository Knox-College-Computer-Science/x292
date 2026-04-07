from sqlalchemy.orm import Session

from . import models, schemas


def get_items(db: Session) -> list[models.TodoItem]:
    return db.query(models.TodoItem).order_by(models.TodoItem.id.desc()).all()


def get_item(db: Session, item_id: int) -> models.TodoItem | None:
    return db.query(models.TodoItem).filter(models.TodoItem.id == item_id).first()


def create_item(db: Session, item_in: schemas.TodoItemCreate) -> models.TodoItem:
    item = models.TodoItem(title=item_in.title, completed=item_in.completed)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_item(db: Session, item: models.TodoItem, item_in: schemas.TodoItemUpdate) -> models.TodoItem:
    if item_in.title is not None:
        item.title = item_in.title
    if item_in.completed is not None:
        item.completed = item_in.completed
    db.commit()
    db.refresh(item)
    return item


def delete_item(db: Session, item: models.TodoItem) -> None:
    db.delete(item)
    db.commit()
