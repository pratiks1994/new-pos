const updateDatabaseSchema = (latestDbVersion, db2) => {
	try {
		const currentDbVersionRow = db2.prepare("SELECT value FROM startup_config WHERE name='db_version'").get();
		const currentDbVersion = +currentDbVersionRow.value;

		if (currentDbVersion !== latestDbVersion) {
			const updateMaps = [
				{
					targetVersion: 2,
					action: async () => {
						// Function to create a new table
						const createTableQuery = `CREATE TABLE IF NOT EXISTS "update_demo" (
                            "id" INTEGER NOT NULL,
                            "column_1" TEXT DEFAULT NULL,
                            PRIMARY KEY("id" AUTOINCREMENT)
                        )`;
						await db2.prepare(createTableQuery).run();
						console.log("Table 'update_demo' created.");
					},
				},
				{
					targetVersion: 3,
					action: async () => {
						// Function to add a new column
						const addColumnQuery = `ALTER TABLE "update_demo" ADD "salary" INT`;
						await db2.prepare(addColumnQuery).run();
						console.log("Column 'salary' added.");
					},
				},
				{
					targetVersion: 4,
					action: async () => {
						// Function to add a new column
						const addColumnQuery = `ALTER TABLE "update_demo" ADD "salary_2" INT`;
						await db2.prepare(addColumnQuery).run();
						console.log("Column 'salary' added.");
					},
				}
				// Add more target versions and corresponding actions here
			];


            
			db2.transaction(async () => {
				for (const map of updateMaps) {
					if (map.targetVersion > currentDbVersion && map.targetVersion <= latestDbVersion) {
						await map.action(); // Execute the corresponding action
					}
				}
				db2.prepare("UPDATE startup_config SET value = ? WHERE name = 'db_version'").run(latestDbVersion);
			})();
		}
	} catch (error) {
		console.error(error);
	}
};

module.exports = { updateDatabaseSchema };
