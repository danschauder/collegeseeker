from google.cloud import storage

"""Set a bucket's CORS policies configuration."""
bucket_name = "dvaspring2021madss.appspot.com"

def cors_configuration(bucket_name):
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    bucket.cors = [
        {
            "origin": ["*"],
            "method": ['GET'],
            "maxAgeSeconds": 3600
        }
    ]
    bucket.patch()

    print("Set CORS policies for bucket {} is {}".format(bucket.name, bucket.cors))
    return bucket

cors_configuration(bucket_name)