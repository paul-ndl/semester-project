# Copyright 2017 Amazon.com, Inc. or its affiliates

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

# http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import sys
import boto3
import key

region_name = "us-east-1"
aws_access_key_id = key.id
aws_secret_access_key = key.key


# Before connecting to MTurk, set up your AWS account and IAM settings as
# described here:
# https://blog.mturk.com/how-to-use-iam-to-control-api-access-to-your-mturk-account-76fe2c2e66e2
#
# Follow AWS best practices for setting up credentials here:
# http://boto3.readthedocs.io/en/latest/guide/configuration.html

# Use the Amazon Mechanical Turk Sandbox to publish test Human Intelligence
# Tasks (HITs) without paying any money.  Sign up for a Sandbox account at
# https://requestersandbox.mturk.com/ with the same credentials as your main
# MTurk account.

# By default, HITs are created in the free-to-use Sandbox
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

# Test that you can connect to the API by checking your account balance
user_balance = client.get_account_balance()

# In Sandbox this always returns $10,000. In live, it will be your acutal balance.
print("Your account balance is {}".format(user_balance["AvailableBalance"]))

# The question we ask the workers is contained in this file.
question_sample = open("question.xml", "r").read()
# question_sample = '<?xml version="1.0" encoding="UTF-8"?><QuestionForm xmlns="http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2005-10-01/QuestionForm.xsd"><Overview><Title>Answer a simple question</Title></Overview><Question><QuestionIdentifier>question1</QuestionIdentifier><DisplayName>What is your favorite color?</DisplayName><IsRequired>true</IsRequired><QuestionContent><Text>Choose your favorite color from the options below:</Text></QuestionContent><AnswerSpecification><SelectionAnswer><StyleSuggestion>radiobutton</StyleSuggestion><Selections><Selection><SelectionIdentifier>red</SelectionIdentifier><Text>Red</Text></Selection><Selection><SelectionIdentifier>blue</SelectionIdentifier><Text>Blue</Text></Selection><Selection><SelectionIdentifier>green</SelectionIdentifier><Text>Green</Text></Selection><Selection><SelectionIdentifier>yellow</SelectionIdentifier><Text>Yellow</Text></Selection></Selections></SelectionAnswer></AnswerSpecification></Question></QuestionForm>'


# Example of using qualification to restrict responses to Workers who have had
# at least 80% of their assignments approved. See:
# http://docs.aws.amazon.com/AWSMechTurk/latest/AWSMturkAPI/ApiReference_QualificationRequirementDataStructureArticle.html#ApiReference_QualificationType-IDs
worker_requirements = [
    {
        "QualificationTypeId": "000000000000000000L0",
        "Comparator": "GreaterThanOrEqualTo",
        "IntegerValues": [80],
        "RequiredToPreview": True,
    }
]

# Create the HIT
response = client.create_hit(
    MaxAssignments=3,
    LifetimeInSeconds=600,
    AssignmentDurationInSeconds=600,
    Reward=mturk_environment["reward"],
    Title="Answer a simple question",
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
