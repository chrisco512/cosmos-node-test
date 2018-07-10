require('dotenv').config();
const express = require('express');
const storage = require('azure-storage');
const uuid = require('uuid/v4');

const accountName = process.env.COSMOS_ACCOUNTNAME;
const primaryKey = process.env.COSMOS_PRIMARYKEY;
const endpoint = process.env.COSMOS_ENDPOINT;

const app = express();
const storageClient = storage.createTableService(accountName, primaryKey, endpoint);
const entGen = storage.TableUtilities.entityGenerator;

app.get('/', (req, res) => {
	storageClient.createTableIfNotExists('mytable', function(error, result, response){
		if(!error){
			// Table exists or created
			res.send('it worked')
		} else {
			res.send('it didnt');
		}
	});
});

app.post('/insert', (req, res) => {
	var entity = {
		PartitionKey: entGen.String('part2'),
		RowKey: entGen.String(uuid()),
		boolValueTrue: entGen.Boolean(true),
		boolValueFalse: entGen.Boolean(false),
		intValue: entGen.Int32(42),
		dateValue: entGen.DateTime(new Date(Date.UTC(2011, 10, 25))),
		complexDateValue: entGen.DateTime(new Date(Date.UTC(2013, 02, 16, 01, 46, 20)))
	};

	console.time('entityInsertion');

	storageClient.insertEntity('mytable', entity, function(error, result, response) {		
		if (!error) {
			console.timeEnd('entityInsertion');
			// result contains the ETag for the new entity
			return res.send(response);
		} else {
			return res.status(400).send(error);
		}
	});
});

app.listen('2000', () => console.log('In the port 2000'));