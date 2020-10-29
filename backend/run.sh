#!/bin/bash
docker build . -t thanakijwanavit/serverless
docker run -v $(pwd):/workdir -v $HOME/.aws/credentials:/root/.aws/credentials -w="/workdir" thanakijwanavit/serverless \
sls deploy --region ap-southeast-1\
$@
