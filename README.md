
# Installation

Clone the project
```sh
git clone https://github.com/nemoeriksson/activityTracker.git 
```

Install node packages
```sh
cd activityTracker
npm install
```

Fix database
```sh
npx prisma migrate reset
npx prisma db push
```

Create `.env` and add following line for a local database file
```js
DATABASE_URL = 'file:./dev.db'
```
