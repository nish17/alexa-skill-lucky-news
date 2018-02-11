\rm -fr Archive.zip
zip -r Archive.zip *
aws lambda update-function-code --function-name newsFunction --zip-file fileb://Archive.zip
