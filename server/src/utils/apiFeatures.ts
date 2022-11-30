import { HydratedDocument, Query } from 'mongoose';

import express from 'express';

type QueryType<T> = Query<
  HydratedDocument<T, {}, {}>[],
  HydratedDocument<T, {}, {}>,
  {},
  T
>;

export type QueryObject = {
  [queries: string]: string;
};

class ApiFeature<ModelType> {
  public query: QueryType<ModelType>;
  public queryString: QueryObject;

  constructor(query: QueryType<ModelType>, queryString: QueryObject) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['fields', 'sort', 'limit', 'page'];

    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.limitFields) {
      const fields = this.queryString.limitFields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 20;

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default ApiFeature;
