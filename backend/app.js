const Dao = require('./dao');
const Masterrepository = require('./repositories/master_repository');

// Initialize required files
const db = new Dao('./database/test1.sqlite3')
const repo = new Masterrepository(db)

repo.sendCommand(`INSERT INTO Persons (PersonIDint, LastName, FirstName, Address, City) VALUES(1, 'Bhuiyan', 'Tanjimul', 'Highland Ave', 'NY');`)