## Description

Acenda Nodejs SDK library. Refer to <a href="https://doc.acenda.com"> API Docs </a> to see full list of methods.

## Installation

```bash
$ npm install acenda
```

or

```bash
$ yarn add acenda
```

## Usage

```
import { Acenda } from 'acenda'
```

## Create

```
const acenda = new Acenda('<store>', '<access_token>')
const result = await acenda.create('product', {})
```

## Update

```
//12345 is id
const acenda = new Acenda('<store>', '<access_token>')
const result = await acenda.update('product','12345', {})
```

## List

Optional parameter is very useful for complex queries

```
const acenda = new Acenda('<store>', '<access_token>')
const result = await acenda.list('order',`query={date_created:{$gte:'2020-04-28'}}`)
```

## Delete

```
//12345 is id
const acenda = new Acenda('<store>', '<access_token>')
const result = await acenda.delete('product', '12345')
```

## Get

```
//26764 is id
const acenda = new Acenda('<store>', '<access_token>')
const result = await acenda.get('product', '26764')
```

## Response

```
{
  code: 200,
  status: 'OK',
  execution_time: 0.10566782951355,
  num_total: 1,
  result: {
    id: 26764,
    group: 'product',
    status: 'active',
    slug: 'test-product',
    name: 'test product',
    collection_id: [],
    category_id: [],
    customer_group_id: [],
    popularity: 0,
    brand: '',
    type: '',
    tags: [],
    description: '',
    cross_sellers: [],
    review_score: 0,
    options: [ 'size' ],
    images: [],
    videos: [],
    dynamic_attributes: [],
    personalization_options: [],
    date_modified: '2020-01-28 09:16:11',
    date_created: '2020-01-28 07:10:47',
    title: 'test product',
    thumbnail: 'https://images.acenda-static.com/zuzu/product/thumbnail/250x250/1/default.jpg',
    url: '/product/test-product',
    category: null,
    taxjar_code: null,
    amazon_enabled: null,
    amazon_posting_template: null,
    collections: [],
    variants: [],
    categories: []
  }
}
```

## Errors

```
  code: 401,
  status: 'Invalid access token',
  error: 'Invalid access token'
```

```
  code: 400,
  status: 'Bad Request',
  execution_time: 0.028566122055054,
  error: 'Specified query is invalid.'
```

```
  code: 403,
  status: 'Forbidden',
  execution_time: 0.028566122055054,
  error: 'Forbidden'
```

```
  code: 404,
  status: 'Not Found',
  execution_time: 0.028566122055054,
  error: 'Not Found'
```

## Tip

Before you create or update a model, first list that model using "list" method. Then get a single record by using "get" method with one of the ids from the returned list. Use returned data as a reference to insert or update a record. Pay attention to matching field types.
