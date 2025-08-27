# Anvesha AI Model Training

## How to train?

* Download Latest Response list from Microsoft Forms
* Convert xslx to csv for simplicity
* now, move raw_data.csv file here
```
python convert_response_to_dataset.py
```
* Responses converted to clean dataset
```
python train_percentage.py
```

This will train the model, and give testing environment to try the model locally
To deploy on website, we convert model to .json
```
python convert_model_to_json.py
```