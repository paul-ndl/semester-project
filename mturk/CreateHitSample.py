import sys
import boto3
import key
import csv


region_name = "us-east-1"
aws_access_key_id = key.id
aws_secret_access_key = key.key

create_hits_in_live = False

environments = {
    "live": {
        "endpoint": "https://mturk-requester.us-east-1.amazonaws.com",
        "preview": "https://www.mturk.com/mturk/preview",
        "manage": "https://requester.mturk.com/mturk/manageHITs",
        "reward": "0.00",
    },
    "sandbox": {
        "endpoint": "https://mturk-requester-sandbox.us-east-1.amazonaws.com",
        "preview": "https://workersandbox.mturk.com/mturk/preview",
        "manage": "https://requestersandbox.mturk.com/mturk/manageHITs",
        "reward": "0.0",
    },
}
mturk_environment = (
    environments["live"] if create_hits_in_live else environments["sandbox"]
)

# use profile if one was passed as an arg, otherwise
client = boto3.client(
    service_name="mturk",
    endpoint_url=mturk_environment["endpoint"],
    region_name=region_name,
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
)

# The question we ask the workers is contained in this file.
question_sample = open("question.xml", "r").read()


worker_requirements = [
    {
        "QualificationTypeId": "000000000000000000L0",
        "Comparator": "GreaterThanOrEqualTo",
        "IntegerValues": [80],
        "RequiredToPreview": True,
    }
]

with open("../mock_processed_data.csv", "r", encoding="utf8") as file:
    reader = csv.reader(file)
    variables = [row for row in reader]


for row in variables[1:]:
    image_nb = row[1]
    description = row[2]

    image_path = str(image_nb).zfill(4) + ".png"
    question_sample = question_sample.replace("path1", image_path)

    title = "New"
    # Create the HIT
    response = client.create_hit(
        MaxAssignments=1,
        LifetimeInSeconds=600,
        AssignmentDurationInSeconds=600,
        Reward=mturk_environment["reward"],
        Title=title,
        Keywords="question, answer, research",
        Description="Answer a simple question. Created from mturk-code-samples.",
        Question=question_sample,
        QualificationRequirements=worker_requirements,
    )

    # The response included several fields that will be helpful later
    hit_type_id = response["HIT"]["HITTypeId"]
    hit_id = response["HIT"]["HITId"]
    print("\nCreated HIT: {}".format(hit_id))

    print("\nYou can work the HIT here:")
    print(mturk_environment["preview"] + "?groupId={}".format(hit_type_id))

    print("\nAnd see results here:")
    print(mturk_environment["manage"])
