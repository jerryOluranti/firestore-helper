import type {
  WhereFilterOp,
  OrderByDirection,
  DocumentData,
  CollectionReference,
  Query,
  WriteResult,
  FieldPath,
  DocumentReference,
  Firestore,
} from "firebase-admin/firestore";

export declare interface FirestoreHelperQuery {
  field: string | FieldPath;
  opStr: WhereFilterOp;
  value: any;
}

export declare class FirestoreHelper {
  constructor(firestore: Firestore, collection: string);
  getCollection(colPath?: string): Promise<any>;
  getDocument(document: string): Promise<any>;
  getCollectionSync(): any;
  getField(document: string, field: string): Promise<any>;
  getDocumentByField(field: string, value: string | number): Promise<any>;
  getDocumentsByQueries(query: FirestoreHelperQuery[]): Promise<any>;
  getDocumentsByQueriesAndOrder(query: FirestoreHelperQuery[], orderBy: OrderByDirection): Promise<any>;
  getDocumentsByQueriesOrderAndLimit(query: FirestoreHelperQuery[], orderBy: OrderByDirection, limit: number): Promise<any>;
  getCollectionWithRef(ref: CollectionReference): Promise<any[]>;
  getDocumentWithRef(ref: CollectionReference): Promise<any>;
  getDocumentWithRefAndQueries(ref: CollectionReference, queries: FirestoreHelperQuery[]): Promise<any>;
  getDocWithSubCollections<T>(document: string, colArr: Array<Extract<keyof T, string>>): Promise<T>;
  getRef(document: string): DocumentReference<DocumentData>;
  create<T>(data: T, document?: string): Promise<T>;
  createDocWithSubCollections<T>(data: any, document: string, colArr: Array<Extract<keyof T, string>>): Promise<T>;
  update(document: string, data: any): Promise<any>;
  delete(document: string): Promise<any>;
  execMultipleQuery(ref: CollectionReference<DocumentData>, queries: FirestoreHelperQuery[]): Query<DocumentData> | undefined;
  convertRefToData<T>(objWithRef: T, refField: Extract<keyof T, string>): Promise<any>;
}
