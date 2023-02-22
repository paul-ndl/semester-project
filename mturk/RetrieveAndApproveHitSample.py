import sys
import boto3
from xml.dom.minidom import parseString
import key
import json

region_name = "us-east-1"
aws_access_key_id = key.id
aws_secret_access_key = key.key

if len(sys.argv) < 2:
    print("You must pass a HIT id as the first argument")
    sys.exit(-1)

hit_id = sys.argv[1]

# By default, we use the free-to-use Sandbox
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
        "reward": "0.00",
    },
}
mturk_environment = (
    environments["live"] if create_hits_in_live else environments["sandbox"]
)


client = boto3.client(
    service_name="mturk",
    endpoint_url=mturk_environment["endpoint"],
    region_name=region_name,
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
)

hit = client.get_hit(HITId=hit_id)
print("Hit {} status: {}".format(hit_id, hit["HIT"]["HITStatus"]))
response = client.list_assignments_for_hit(
    HITId=hit_id,
    AssignmentStatuses=["Submitted", "Approved"],
    MaxResults=10,
)

assignments = response["Assignments"]
print("The number of submitted assignments is {}".format(len(assignments)))
for assignment in assignments:
    worker_id = assignment["WorkerId"]
    assignment_id = assignment["AssignmentId"]
    answer_xml = parseString(assignment["Answer"])

    answer = answer_xml.getElementsByTagName("FreeText")[0]
    only_answer = " ".join(
        t.nodeValue for t in answer.childNodes if t.nodeType == t.TEXT_NODE
    )

    answer = json.loads(only_answer)
    print('Value : ', answer)

    if assignment["AssignmentStatus"] == "Submitted":
        print("Approving Assignment {}".format(assignment_id))
        client.approve_assignment(
            AssignmentId=assignment_id,
            RequesterFeedback="good",
            OverrideRejection=False,
        )
