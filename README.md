# checkmoney

> Simple and powerful money tracker.

Site: https://checkmoney.space

## Development

### Database

You need to have installed [postgres](https://www.postgresql.org) and pass parameters to .env file in back dir.

```sh
yarn
  
cd back
yarn evolutions:init
yarn evolutions:run
```

### Environment

```sh
cd back
cp .env.dist .env
```

### Start

```sh
cd back
yarn start:back:dev
```

**back running on localhost:3000**

### Commit

```sh
yarn s cz
```
