/* eslint-disable operator-linebreak */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import {
  OrderByDirection,
  DocumentData,
  CollectionReference,
  Query,
  WriteResult,
  DocumentReference,
  Firestore,
} from "firebase-admin/firestore";
import type { FirestoreHelperQuery } from '../index.d';

export class FirestoreHelper {

  constructor(protected firestore: Firestore, protected collection: string) {}
  public async getCollection(colPath?: string): Promise<any> {
    return await (
      await this.firestore.collection(colPath || this.collection).get()
    ).docs.map((each) => {
      return { id: each.id, ...each.data() };
    });
  }

  public async getDocument(
    document: string,
  ): Promise<any> {
    return await (
      await this.firestore.collection(this.collection).doc(document).get()
    ).data();
  }

  public getCollectionSync() {
    this.firestore
      .collection(this.collection)
      .get()
      .then((snapshot) => {
        if (!snapshot) throw new Error('error getting collection');
        return snapshot.docs.map((d) => d.data());
      });
  }

  public async getField(
    document: string,
    field: string,
  ): Promise<any> {
    const res = (await this.firestore.collection(this.collection).doc(document).get()).data();
    if (!res) return undefined;
    return res[field];
  }

  public async getDocumentByField(
    field: string,
    value: any,
  ): Promise<any> {
    return (
      await this.firestore.collection(this.collection).where(field, '==', value).get()
    ).docs.map((each) => each.data());
  }

  public async getDocumentsByQueries(
    queries: FirestoreHelperQuery[],
  ): Promise<any> {
    return await (
      await this.execMultipleQuery(
        this.firestore.collection(this.collection),
        queries,
      )?.get()
    )?.docs.map((each) => each.data());
  }

  public async getDocumentsByQueriesAndOrder(
    queries: FirestoreHelperQuery[],
    orderBy: OrderByDirection,
  ): Promise<any> {
    return await (
      await this.execMultipleQuery(this.firestore.collection(this.collection), queries)?.orderBy(orderBy).get()
    )?.docs.map((each) => each.data());
  }

  public async getCollectionWithRef(ref: CollectionReference) {
    return (await ref.get()).docs.map((each) => each.data());
  }

  public async getDocumentWithRef(ref: DocumentReference) {
    return (await ref.get()).data();
  }

  public async getDocumentsWithRefAndQuery(
    ref: CollectionReference,
    queries: Array<FirestoreHelperQuery>,
  ) {
    return await (
      await this.execMultipleQuery(ref, queries)?.get()
    )?.docs.map((each) => each.data());
  }

  public async getDocumentByQueriesOrderAndLimit(
    queries: FirestoreHelperQuery[],
    orderBy: OrderByDirection,
    limit: number,
  ): Promise<any> {
    return await (
      await this.execMultipleQuery(this.firestore.collection(this.collection), queries)?.orderBy(orderBy).limit(limit).get()
    )?.docs.map((each) => each.data());
  }
  public getDocWithSubcollections<T>(
    document: string,
    colArr: Array<Extract<keyof T, string>>,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.getDocument(document).then((data: Partial<T>) => {
        Promise.all(
          colArr.map(
            (col) =>
              this.getCollection(
                `${this.collection}/${document}/${col}`,
              ) as unknown as T[Extract<keyof T, string>],
          ),
        ).then((result) => {
          colArr.forEach((col, idx) => {
            data[col] = result[idx];
          });
          resolve(data as T);
        }).catch((err) => reject(err));
      });
    });
  }

  public getRef(document: string) {
    if (this.collection === '' || document === '') {
      throw new Error('Invalid arguements!');
    }

    return this.firestore.collection(this.collection).doc(document);
  }

  public async create<T>(
    data: T,
    document?: string,
  ): Promise<DocumentData> {
    const docRef = document
      ? this.firestore.collection(this.collection).doc(document)
      : this.firestore.collection(this.collection).doc();
    await docRef.set(data);
    return await (await docRef.get()).data() as T;
  }

  public async createDocWithSubCollections<T>(
    data: any,
    document: string,
    colArr: Array<Extract<keyof T, string>>,
  ) {
    await this.create( data, document);
    const ref = this.getRef(document);

    colArr.forEach(async (col) => {
      await ref.collection(col.toString()).add({ createdAt: Date.now() });
    });

    return await this.getDocWithSubcollections<T>(document, colArr);
  }

  public async update(
    document: string,
    data: any,
  ): Promise<any> {
    const docRef = this.firestore.collection(this.collection).doc(document);
    await docRef.set(data, { merge: true });
    return await (await docRef.get()).data();
  }

  public async delete(
    document: string,
  ): Promise<WriteResult> {
    return await this.firestore.collection(this.collection).doc(document).delete();
  }

  private execMultipleQuery(
    ref: CollectionReference<DocumentData>,
    queries: FirestoreHelperQuery[],
  ): Query<DocumentData> | undefined {
    if (queries.length === 0) {
      throw new Error('No queries provided');
    }

    const queryRef = queries
      .map((each) => ref.where(each.field, each.opStr, each.value))
      .pop();

    return queryRef;
  }

  public async convertRefToData<T>(objWithRef: T, refField: Extract<keyof T, string>): Promise<any> {
    if (!Object.keys(objWithRef).includes(refField)) throw new Error(`Field ${refField} does not exist in ${objWithRef}`);
    const data = await this.getDocumentWithRef(objWithRef[refField] as unknown as DocumentReference<DocumentData>);
    if (!data) throw new Error(`The reference provided could not retrieve a document`);
    objWithRef[refField] = data as any;
    return objWithRef;
  }
}
