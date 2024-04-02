import os

env_file = os.path.join(os.path.dirname(__file__), '../.env')
workflow = os.path.join(os.path.dirname(__file__), 'push.yml')
workflow_output = os.path.join(os.path.dirname(__file__), '../.github/workflows/push.yml')

def get_secrets_array():
    with open(env_file, 'r') as f:
        secrets = f.readlines()
        secrets = [secret.strip().split("=")[0] for secret in secrets]
        return secrets

def gen_params_workflow(secrets):
    s = ""
    for secret in secrets:
        s += f"\t\t\t\t\techo \"{secret}=${{ secrets.{secret} }}\" >> .env\n"
    return s

def gen_files():
    secrets = get_secrets_array()
    with open(workflow, 'r') as f:
        read = f.read()
        with open(workflow_output, 'w') as f:
            f.write(read.replace("SECRETS", gen_params_workflow(secrets)))

gen_files()
