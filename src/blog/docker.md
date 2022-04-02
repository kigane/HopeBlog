---
icon: page
title: Docker入门
author: Leonhardt
category: Tool
tag:
  - docker
sidebarDepth: 1
sticky: false
star: false
time: 2022-04-01
---

## 基本命令
* `docker pull image` 从Docker仓库中拉取镜像。
* `docker run image` 创建一个新的容器, 启动镜像。如果镜像不存在，则会尝试先从Docker仓库中拉取。
    * -d 后台运行
    * -p 81:80 将主机的81端口和Docker Container的80端口绑定
    * --name custonName 
* `docker start <the-container-id>` 启动容器
* `docker stop <the-container-id>` 关闭容器
* `docker ps` 显示当前运行的容器。
    * -a 所有容器，包括已停止的。
* `docker log name` 显示日志
* `docker exec -it name|<the-container-id> /bin/bash` 打开容器的交互式终端。可用于Debug环境。
    * -it 打开交互式终端

## 创建镜像
* `docker build -t getting-started .` 创建一个镜像
    * -t 镜像名
    * . dockerfile所在文件夹
* `docker rm <the-container-id>` 删除镜像

## 上传镜像
* `docker login -u YOUR-USER-NAME` 登录
* `docker tag image YOUR-USER-NAME/image_new_name` 给镜像标tag。
* `docker push YOUR-USER-NAME/image_new_name` 上传镜像

## 数据持久化
容器的文件系统：每个容器有独立的文件系统，在一个容器中创建，更新，删除文件不会影响到其他容器。

Container Volumes：容器的文件系统都是独立的，在容器被删除时，其文件系统中的文件也不会保留。此外，容器也不能共享文件。Volumes提供了将容器中的文件路径和主机连接起来的能力。Volume可以看作一个存数据的空间，其在主机中的具体位置由Docker管理，用户只要记住Volume的名字即可使用。

`docker volume create todo-db` 创建Volume
`docker run -dp 3000:3000 -v todo-db:/etc/todos getting-started` 在创建容器时用-v选项指定Volume在容器中挂载的位置


Volumes有两种主要类型，一种named volume主要用于存储数据，不需要关注数据具体存在哪里。一种bind mount，用于热更新，增加数据。

`docker run -dp 3000:3000 -w /app -v "$(pwd):/app" node:12-alpine sh -c "yarn install && yarn run dev` 
    -w /app 指定app在容器中的工作目录
    -v "$(pwd):/app" 前面是主机目录，后面是容器目录。将主机目录挂载到容器目录上。注意，主机目录应该这样写"/c/Docker/app"，即在c盘的Docker/app文件夹。
    sh -c "yarn install && yarn run dev 安装依赖并启动nodemon监视源码，如有改动，立即更新。

## 多容器应用
* In general, each container should do one thing and do it well.
* If two containers are on the same network, they can talk to each other. If they aren't, they can't.

* `docker network create todo-app` 创建网络
* `docker run -d --network todo-app --network-alias mysql -v todo-mysql-data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=todos mysql:5.7`
    * --network-alias 定义容器在网络中的别名，可以当做IP地址使用。
    * -v todo-mysql-data:/var/lib/mysql 我们没有手动创建todo-mysql-data Volume，这里docker知道你要用named volume，会自动帮你创建。
    * -e 设置环境变量
* `docker exec -it <mysql-container-id> mysql -p` 进入数据库，输入`SHOW DATABASES;`应该能看到todos数据库。

* [nicolaka/netshoot](https://github.com/nicolaka/netshoot) container：包含很多处理网络相关事务的工具。
* `docker run -it --network todo-app nicolaka/netshoot` 启动工具。在工具命令行中输入dig mysql，徐结果如下。其中ANSWER SECTION中表示mysql对应的IP为172.23.0.2。mysql不是有效的主机名，而是我们用--network-alias定义的别名。在容器网络中可以直接用这个别名代替IP地址。

```md
; <<>> DiG 9.14.1 <<>> mysql
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 32162
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
;mysql.             IN  A

;; ANSWER SECTION:
mysql.          600 IN  A   172.23.0.2

;; Query time: 0 msec
;; SERVER: 127.0.0.11#53(127.0.0.11)
;; WHEN: Tue Oct 01 23:47:24 UTC 2019
;; MSG SIZE  rcvd: 44
```

* `docker run -dp 3000:3000 -w /app -v "$(pwd):/app" --network todo-app -e MYSQL_HOST=mysql -e MYSQL_USER=root -e MYSQL_PASSWORD=secret -e MYSQL_DB=todos node:12-alpine sh -c "yarn install && yarn run dev"` 启动app并设置环境变量以连接到mysql。

* `docker exec -it <mysql-container-id> mysql -p todos` 进入todos数据库，执行select * from todo_items查看添加的todo条目。

## 使用Docker Compose简化多容器应用
上一节创建一个多容器app步骤较繁琐。使用Docker Compose可以简化。(如果是在Linux上首先需要安装Docker Compose)

1. 在项目根目录中新建docker-compose.yml文件
2. 使用配置文件定义服务，以实现和上一节同样的效果
3. 运行：`docker-compose up -d`
4. 查看日志: `docker-compose logs -f`
5. 关闭: `docker-compose up`

```yaml
version: "3.8" # schema version
services:
  app: # 服务名会自动作为--network-alias
    image: node:12-alpine # 要运行的镜像
    command: sh -c "yarn install && yarn run dev" # 容器创建后要执行的命令
    ports: # 端口映射 -p
      - 3000:3000
    working_dir: /app # 指定容器工作目录 -w
    volumes: # volume映射 -v
      - ./:/app
    environment: # 环境变量 -e
      MYSQL_HOST: mysql
      MYSQL_USER: root
      MYSQL_PASSWORD: secret
      MYSQL_DB: todos
  
  mysql:
    image: 'mysql:5.7'
    volumes:
      - todo-mysql-data:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=secret
      - MYSQL_DATABASE=todos

volumes: # 创建 named volume
  todo-mysql-data:
```

在Docker Desktop中查看，这个app显示为app(项目所在文件夹的名字)。app下的容器名为`<project-name>_<service-name>_<replica-number>`。

## 创建镜像的最佳实践

### layer caching
- dockerfile的每一行为一层(layer)，一但某层需要重新执行，则其下所有层都会重新执行。  
- dockerfile缓存机制

```yaml
FROM node:12-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "src/index.js"]
```

每次重新创建镜像的时候，都会从头开始构建：新建app目录，将原镜像的文件复制过来，执行yarn install安装依赖，最后执行node src/index.js运行服务。问题在于：parent镜像执行过yarn install后，工作目录中会多一个npm_modules的文件夹，里面是yarn安装的各种依赖，通常比较大，而且内容主要是数量极多的小文件。复制操作极为耗时。因此，最佳实践如下

```yaml
FROM node:12-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
CMD ["node", "src/index.js"]
```

修改dockfile后，再在工作目录新建一个文件`.dockerignore`，内容为`npm_modules`，意思是不将npm_modules文件夹放到构建上下文(build context)中。此时重新创建镜像时：先复制`package.json`(要安装的依赖)和`yarn.lock`(已安装的依赖)两个文件，再执行yarn install，此时如果前两个文件内容未变，yarn不会重新安装依赖。接着执行COPY将其他文件复制过来，`npm_modules`直接使用缓存。
