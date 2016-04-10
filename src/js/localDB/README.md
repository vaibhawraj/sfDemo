# localDB v1.0.0

> Manages all low-level interaction with local Database for app

## Initializing Database

At the beginning of app loading, load Database with following code:

```javascript
localDB.openDatabase('sfData');
```

This creates/opens 'sfData' Database.

## Basic API's

### createTable(name, fields)

```javascript
var fields = [
	"name",
    "industry",
    "revenue"
];
localDB.createTable('account',fields);
```

This creates a blank table with name 'account' and with fields name,
I'm no good at writing sample / filler text, so go write something yourself.
