---
icon: page
title: SqlAlchemy
author: Leonhardt
category: Python
tag:
  - python
  - database
sidebarDepth: 1
sticky: false
star: false
time: 2022-04-06
---

## 基本用法

### 创建表

```python
import os
from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

BASE_DIR = os.path.dirname(os.path.realpath(__file__))
connection_str = 'sqlite:///' + os.path.join(BASE_DIR, 'user.db')

Base = declarative_base() # 声明table
Session = sessionmaker() # 用于管理事物
engine = create_engine(connection_str, echo=True) # 连接数据库, echo=True表示将使用的sql语句打印出来。

# TABLE
class User(Base):
    __tablename__ = 'users' # 表名
    id = Column(Integer(), primary_key=True)
    username = Column(String(5), nullable=False, unique=True)
    email = Column(String(80), nullable=False, unique=True)
    date_created = Column(DateTime(), default=datetime.utcnow)

    def __repr__(self) -> str:
        return f'User(id={self.id}, username={self.username}, email={self.email}, date_created={self.date_created})'

Base.metadata.create_all(engine) # 如果有table声明了但没创建，则创建它
```

### 增删改查


<CodeGroup>
<CodeGroupItem title="查">

```python
from main import Session, User, engine

local_session = Session(bind=engine)  # 创建会话

# select * from users
users = local_session.query(User).all()
for user in users:
    print(user)

# select one from users where user.username = one
jolin = local_session.query(User).filter(User.username=='jolin').first()
print(jolin)
```
</CodeGroupItem>

<CodeGroupItem title="增">

```python
from main import Session, User, engine

local_session = Session(bind=engine) # 创建会话

users = [
    {
        'username': 'jack',
        'email': 'jack@tree.com'
    },
    {
        'username': 'jolin',
        'email': 'jolin@tree.com'
    },
    {
        'username': 'malina',
        'email': 'malina@tree.com'
    },
]

for user in users:
    new_user = User(**user)
    local_session.add(new_user)

local_session.commit()
```
</CodeGroupItem>

<CodeGroupItem title="删">

```python
from main import User, Session, engine

local_session = Session(bind=engine)  # 创建会话

user_to_delete = local_session.query(User).filter(User.username=='jolin').first()

local_session.delete(user_to_delete)
local_session.commit()
```
</CodeGroupItem>

<CodeGroupItem title="改">

```python
from main import User, Session, engine

local_session = Session(bind=engine)  # 创建会话

user_to_update = local_session.query(User).filter(User.username=='jolin').first()
user_to_update.username = 'jojo'
user_to_update.email = 'jojo@spw.com'
local_session.commit()
```
</CodeGroupItem>
</CodeGroup>

