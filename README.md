# robin 🏹
### An helper library that simplifies Firebase Firestore operations and queries

This library is built on the firebase-admin sdk, thus limiting it to server side usage only.

-----------
## Features
- Methods for CRUD operations on Documents and Collections
- Create and manage references
- Query, Order and Limit support
- Create and manage Sub-Collections

----------
# Getting Started

### Install

`npm i robin` or `yarn add robin`

### Import

`import { FirestoreHelper } from "robin"` or `const { FirestoreHelper } = require("robin")`

### Create Instance

```
  const catCollection = new FirestoreHelper(firestore, 'cats😼');
  // firestore => FirebaseFirestore.Firestore object
  // collection => string
```

Wohooo🚀🚀🚀

----------

🪲 Report bugs and issues on the [git repo](https://github.com/jerryOluranti/robin/issues)

⭐ Remember to leave a star on the repository

💞 Follow me on [twitter](https://twitter.com/_oluranti)
