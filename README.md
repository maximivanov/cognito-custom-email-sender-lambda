# Cognito Custom Email and SMS Sender Lambda trigger

Deploy with CloudFormation and Terraform.

Code for [Send AWS Cognito emails with 3rd party ESPs](https://www.maxivanov.io/send-aws-cognito-emails-with-3rd-party-esps/)

## Install npm dependencies

```bash
cd lambda

docker run -it --rm -v $(pwd):/var/app node:12 bash

npm i
```

## Cloudformation

```bash
docker run --rm -it -v $(pwd):/var/app --entrypoint bash amazon/aws-cli
```

```bash
aws configure
```

```bash
aws s3api create-bucket --bucket cognito-custom-email-sender-lambda-assets
```

```bash
aws cloudformation validate-template --template-body file://cloudformation/stack.yaml
{
    "Parameters": [
        {
            "ParameterKey": "ProjectName",
            "NoEcho": false,
            "Description": "Project name"
        },
        {
            "ParameterKey": "SendgridApiKey",
            "NoEcho": false,
            "Description": "Sendgrid API key"
        },
        {
            "ParameterKey": "CallingUserArn",
            "NoEcho": false,
            "Description": "Calling user ARN"
        }
    ],
    "Capabilities": [
        "CAPABILITY_IAM"
    ],
    "CapabilitiesReason": "The following resource(s) require capabilities: [AWS::IAM::Role]"
}
```

```bash
aws cloudformation package --template-file cloudformation/stack.yaml --s3-bucket cognito-custom-email-sender-lambda-assets --output-template-file cloudformation/stack-packaged.yaml

Successfully packaged artifacts and wrote output template to file cloudformation/stack-packaged.yaml.
Execute the following command to deploy the packaged template
aws cloudformation deploy --template-file /var/app/cloudformation/stack-packaged.yaml --stack-name <YOUR STACK NAME>
```

```bash
aws cloudformation deploy --template-file cloudformation/stack-packaged.yaml --stack-name cognito-custom-email-sender-cf-stack --parameter-overrides ProjectName=cognito-custom-email-sender CallingUserArn="$(aws sts get-caller-identity --query Arn --output text)" SendgridApiKey="<API_KEY>" --capabilities CAPABILITY_IAM

Waiting for changeset to be created..
Waiting for stack create/update to complete
Successfully created/updated stack - cognito-custom-email-sender-cf-stack
```

```bash
aws cloudformation describe-stacks --stack-name cognito-custom-email-sender-cf-stack --query "Stacks[0].Outputs"
[
    {
        "OutputKey": "UserPoolClientId",
        "OutputValue": "3625vec7....",
        "Description": "User pool client ID"
    },
    {
        "OutputKey": "UserPoolId",
        "OutputValue": "us-east-1_CV7g...",
        "Description": "User pool ID"
    }
]
```

```bash
aws cognito-idp sign-up --client-id <CLIENT_ID> --username hello@maxivanov.io --password <PASSOWORD> --user-attributes Name="name",Value="Max Ivanov"
{
    "UserConfirmed": false,
    "CodeDeliveryDetails": {
        "Destination": "h***@m***.io",
        "DeliveryMedium": "EMAIL",
        "AttributeName": "email"
    },
    "UserSub": "51c9045e-2f3e-4..."
}
```

```bash
aws cloudformation delete-stack --stack-name cognito-custom-email-sender-cf-stack
```

## Terraform

```bash
docker run --rm -it -v $(pwd):/var/app --entrypoint bash amazon/aws-cli
```

```bash
aws configure
```

```bash
yum install -y yum-utils
Loaded plugins: ovl, priorities
amzn2-core                                                                                                                                                                                                                                                                                             | 3.7 kB  00:00:00
Resolving Dependencies
...
```

```bash
yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
Loaded plugins: ovl, priorities
adding repo from: https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
grabbing file https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo to /etc/yum.repos.d/hashicorp.repo
repo saved to /etc/yum.repos.d/hashicorp.repo
```

```bash
yum -y install terraform
Loaded plugins: ovl, priorities
hashicorp                                                                                                                                                                                                                                                                                              | 1.4 kB  00:00:00
hashicorp/2/x86_64/primary                                                                                                                                                                                                                                                                             |  39 kB  00:00:00
hashicorp                                                                                                                                                                                                                                                                                                             255/255
Resolving Dependencies
...
```

```bash
cd terraform

terraform init
```

```bash
# without update-user-pool null_resource
terraform apply -var="sendgrid_api_key=<API_KEY>" -var="project=tf-cognito-custom-email-sender" -var="update_user_pool_config_file=input.json"
```

```bash
aws cognito-idp update-user-pool --user-pool-id us-east-1_evzTb... --generate-cli-skeleton input
```

```bash
aws cognito-idp describe-user-pool --user-pool-id us-east-1_evzTb... --query UserPool > input.json
```

```bash
# with update-user-pool null_resource
terraform apply -var="sendgrid_api_key=<API_KEY>" -var="project=tf-cognito-custom-email-sender" -var="update_user_pool_config_file=input.json"
```

```bash
aws cognito-idp sign-up --client-id <CLIENT_ID> --username hello@maxivanov.io --password <PASSOWORD> --user-attributes Name="name",Value="Max Ivanov"
{
    "UserConfirmed": false,
    "CodeDeliveryDetails": {
        "Destination": "h***@m***.io",
        "DeliveryMedium": "EMAIL",
        "AttributeName": "email"
    },
    "UserSub": "51c9045e-2f3e-4..."
}
```

```bash
terraform destroy -var="sendgrid_api_key=<API_KEY>" -var="project=tf-cognito-custom-email-sender" -var="update_user_pool_config_file=input.json"
```