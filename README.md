# firestored 🔥
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

`npm i firestored` or `yarn add firestored`

### Import

`import { FirestoreHelper } from "firestored"` or `const { FirestoreHelper } = require("firestored")`

### Create Instance

```
  const catCollection = new FirestoreHelper(firestore, 'cats😼');
  // firestore => FirebaseFirestore.Firestore object
  // collection => string
```

Check [here](https://github.com/jerryOluranti/firestored/blob/main/index.d.ts) for available methods for I am too ~lazy~ busy to write docs at the moment 🦥😂

Wohooo🚀🚀🚀

----------

🪲 Report bugs and issues on the [git repo](https://github.com/jerryOluranti/firestored/issues)

⭐ Remember to leave a star on the repository

💞 Follow me on [twitter](https://twitter.com/_oluranti)
