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
const result = await acenda.update('product',12345, {})
```

## List

```
const acenda = new Acenda('<store>', '<access_token>')
const result = await acenda.list('product')
```

## Get

```
//12345 is id
const acenda = new Acenda('<store>', '<access_token>')
const result = await acenda.get('product', 12345)
```

## Delete

```
//12345 is id
const acenda = new Acenda('<store>', '<access_token>')
const result = await acenda.delete('product', 12345)
```

## Tip

Before you create or update a model, first list that model using list method. Then Get a single record by using get method with one of the returned ids from list. Returned data is available to insert or update. Be careful to matching field types
