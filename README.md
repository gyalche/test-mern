# MERN Stack dawa-sherpa test

Todo Task is a task management system, developed using MERN stack.

## Installation
cd frontend

```bash
npm install
```
cd backend

```bash
npm install
```
### To run the system in docker
```bash
docker compose up --build
```

### To run the locally make sure to change the BASE URL of MongoDB I have commented in env
```bash
cd frotned-> npm run dev | cd backend->nodemon

```
## To run test cases
```bash
cd frotned-> 'npm run test' | cd backend->'npm run test' || for integration test run 'npm run cypress'
```
## FEATURES

###  Authetication part
 1. user register(by default the role is user. If you want to create role admin login type admin secret key i.e '1234' in the given input field)
2. activate user account with top
3. for forget password reset-password opt will be send.

### Home page
1. create task
2. list of all your task(admin account can view all the task of every user but  can't update and delete)
3. update task, delete task, add to complete.
4. view all complete task. You can remove from complete to incomplete
5. Filter search and pagination, dateFilter in task lists
6. user can upload profile  picture | update their account
7. user can change password with old-password

### Admin functionally
1. admin can view all the task created and all users account details.