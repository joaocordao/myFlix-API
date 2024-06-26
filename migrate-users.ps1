# Define your connection strings
$sourceConnectionString = "mongodb+srv://jpcordao:Jp%404959778@cluster80.9wmdgtv.mongodb.net/myFlixDB?retryWrites=true&w=majority&appName=Cluster80"
$targetConnectionString = "mongodb+srv://jpcordao:Jp%404959778@cluster80.9wmdgtv.mongodb.net/cfDB?retryWrites=true&w=majority&appName=Cluster80"

# Define collection and database names
$sourceDatabase = "myFlixDB"
$sourceCollection = "cfDB"
$targetDatabase = "cfDB"
$targetCollection = "users"

# Define the file to export and import
$exportFile = "users.json"

# Export data from the source collection
Write-Host "Exporting data from $sourceDatabase.$sourceCollection (users)..."
mongoexport --uri=$sourceConnectionString --db=$sourceDatabase --collection=$sourceCollection --out=$exportFile
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error exporting data" -ForegroundColor Red
    exit $LASTEXITCODE
}

# Import data into the target collection
Write-Host "Importing data to $targetDatabase.$targetCollection..."
mongoimport --uri=$targetConnectionString --db=$targetDatabase --collection=$targetCollection --file=$exportFile
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error importing data" -ForegroundColor Red
    exit $LASTEXITCODE
}

# Clean up the exported JSON file
Remove-Item $exportFile

Write-Host "Data migration completed successfully"
