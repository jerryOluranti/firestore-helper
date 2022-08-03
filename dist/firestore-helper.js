"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreHelper = void 0;
class FirestoreHelper {
    constructor(firestore, collection) {
        this.firestore = firestore;
        this.collection = collection;
    }
    getCollection(colPath) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.firestore.collection(colPath || this.collection).get()).docs.map((each) => {
                return Object.assign({ id: each.id }, each.data());
            });
        });
    }
    getDocument(document) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.firestore.collection(this.collection).doc(document).get()).data();
        });
    }
    getCollectionSync() {
        this.firestore
            .collection(this.collection)
            .get()
            .then((snapshot) => {
            if (!snapshot)
                throw new Error('error getting collection');
            return snapshot.docs.map((d) => d.data());
        });
    }
    getField(document, field) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = (yield this.firestore.collection(this.collection).doc(document).get()).data();
            if (!res)
                return undefined;
            return res[field];
        });
    }
    getDocumentByField(field, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.firestore.collection(this.collection).where(field, '==', value).get()).docs.map((each) => each.data());
        });
    }
    getDocumentsByQueries(queries) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            return yield ((_b = (yield ((_a = this.execMultipleQuery(this.firestore.collection(this.collection), queries)) === null || _a === void 0 ? void 0 : _a.get()))) === null || _b === void 0 ? void 0 : _b.docs.map((each) => each.data()));
        });
    }
    getDocumentsByQueriesAndOrder(queries, orderBy) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            return yield ((_b = (yield ((_a = this.execMultipleQuery(this.firestore.collection(this.collection), queries)) === null || _a === void 0 ? void 0 : _a.orderBy(orderBy).get()))) === null || _b === void 0 ? void 0 : _b.docs.map((each) => each.data()));
        });
    }
    getCollectionWithRef(ref) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield ref.get()).docs.map((each) => each.data());
        });
    }
    getDocumentWithRef(ref) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield ref.get()).data();
        });
    }
    getDocumentsWithRefAndQuery(ref, queries) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            return yield ((_b = (yield ((_a = this.execMultipleQuery(ref, queries)) === null || _a === void 0 ? void 0 : _a.get()))) === null || _b === void 0 ? void 0 : _b.docs.map((each) => each.data()));
        });
    }
    getDocumentByQueriesOrderAndLimit(queries, orderBy, limit) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            return yield ((_b = (yield ((_a = this.execMultipleQuery(this.firestore.collection(this.collection), queries)) === null || _a === void 0 ? void 0 : _a.orderBy(orderBy).limit(limit).get()))) === null || _b === void 0 ? void 0 : _b.docs.map((each) => each.data()));
        });
    }
    getDocWithSubcollections(document, colArr) {
        return new Promise((resolve, reject) => {
            this.getDocument(document).then((data) => {
                Promise.all(colArr.map((col) => this.getCollection(`${this.collection}/${document}/${col}`))).then((result) => {
                    colArr.forEach((col, idx) => {
                        data[col] = result[idx];
                    });
                    resolve(data);
                }).catch((err) => reject(err));
            });
        });
    }
    getRef(document) {
        if (this.collection === '' || document === '') {
            throw new Error('Invalid arguements!');
        }
        return this.firestore.collection(this.collection).doc(document);
    }
    create(data, document) {
        return __awaiter(this, void 0, void 0, function* () {
            const docRef = document
                ? this.firestore.collection(this.collection).doc(document)
                : this.firestore.collection(this.collection).doc();
            yield docRef.set(data);
            return yield (yield docRef.get()).data();
        });
    }
    createDocWithSubCollections(data, document, colArr) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.create(data, document);
            const ref = this.getRef(document);
            colArr.forEach((col) => __awaiter(this, void 0, void 0, function* () {
                yield ref.collection(col.toString()).add({ createdAt: Date.now() });
            }));
            return yield this.getDocWithSubcollections(document, colArr);
        });
    }
    update(document, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const docRef = this.firestore.collection(this.collection).doc(document);
            yield docRef.set(data, { merge: true });
            return yield (yield docRef.get()).data();
        });
    }
    delete(document) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.firestore.collection(this.collection).doc(document).delete();
        });
    }
    execMultipleQuery(ref, queries) {
        if (queries.length === 0) {
            throw new Error('No queries provided');
        }
        const queryRef = queries
            .map((each) => ref.where(each.field, each.opStr, each.value))
            .pop();
        return queryRef;
    }
    convertRefToData(objWithRef, refField) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Object.keys(objWithRef).includes(refField))
                throw new Error(`Field ${refField} does not exist in ${objWithRef}`);
            const data = yield this.getDocumentWithRef(objWithRef[refField]);
            if (!data)
                throw new Error(`The reference provided could not retrieve a document`);
            objWithRef[refField] = data;
            return objWithRef;
        });
    }
}
exports.FirestoreHelper = FirestoreHelper;
