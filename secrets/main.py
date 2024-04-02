import os

env_file = os.path.join(os.path.dirname(__file__), '.env')
dockerfile = os.path.join(os.path.dirname(__file__), 'Dockerfile')
workflow = os.path.join(os.path.dirname(__file__), 'push.yml') 

secrets = []

def get_secrets_array():
    print(env_file)
    with open(env_file, 'r') as f:
        secretsl = f.readlines()
        secretsl = [secret.strip().split("=")[0] for secret in secrets]
        print(secretsl)
        return secretsl
    

def gen_params_dockerfile():
    s = ""
    for secret in secrets:
        s += f"RUN --mount=type=secret,id={secret} echo \"{secret}=$(cat /run/secrets/{secret})\" >> .env\n"
    return s

def gen_params_workflow():
    s = ""
    for secret in secrets:
        s += f"echo \"{secret}=${{ secrets.{secret} }}\" >> .env\n"
    return s

def gen_files():
    print("Generating files")
    secrets = get_secrets_array()
    print(secrets)
    with open(dockerfile, 'r') as f:
        read = f.read()
        with open(dockerfile + ".new", 'w') as f:
            f.write(read.replace("SECRETS",gen_params_dockerfile()))
    with open(workflow, 'r') as f:
        read = f.read()
        with open(workflow + ".new", 'w') as f:
            f.write(read.replace("SECRETS",gen_params_workflow()))
        
gen_files()
