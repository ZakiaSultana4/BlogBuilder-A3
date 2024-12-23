import { FilterQuery, Query, Types } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.search;

    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }
    return this;
  }

  filter() {
    const queryObj: { [key: string]: unknown } = { ...this.query };
    const excludeFields = ['search', 'sortBy', 'sortOrder', 'page', 'limit'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Map the `filter` field to the `author` field in the database
    if (queryObj.filter) {
      queryObj['author'] = new Types.ObjectId(queryObj.filter as string);
      delete queryObj.filter; // Remove the `filter` key after mapping
    }

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  sort() {
    const sortBy = this?.query?.sortBy as string;
    const sortOrder = this?.query?.sortOrder === 'desc' ? '-' : '';

    const sortString = sortBy ? `${sortOrder}${sortBy}` : '-createdAt';

    this.modelQuery = this.modelQuery.sort(sortString);
    return this;
  }
}

export default QueryBuilder;
